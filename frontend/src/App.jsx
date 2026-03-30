import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiCall } from './api.js';
import { getDemoLoginDefaults } from './demo/authDefaults.js';
import { buildDemoDetailsBody, getDemoCategoryId } from './demo/buildDemoDetails.js';

function useDomainEventStream(onMessage) {
  const [sseStatus, setSseStatus] = useState('connecting');

  useEffect(() => {
    const es = new EventSource('/events/stream');
    es.onopen = () => setSseStatus('open');
    es.onerror = () => setSseStatus('error');
    es.onmessage = (ev) => {
      try {
        const parsed = JSON.parse(ev.data);
        onMessage(parsed);
      } catch {
        onMessage({ type: 'parse_error', raw: ev.data });
      }
    };
    return () => es.close();
  }, [onMessage]);

  return sseStatus;
}

export default function App() {
  const loginDefaults = useMemo(() => getDemoLoginDefaults(), []);
  const [email, setEmail] = useState(loginDefaults.email);
  const [password, setPassword] = useState(loginDefaults.password);
  const [token, setToken] = useState('');
  const [productId, setProductId] = useState('');
  const [productJson, setProductJson] = useState(null);
  const [log, setLog] = useState([]);
  const [error, setError] = useState('');

  const appendLog = useCallback((entry) => {
    setLog((prev) => [{ ...entry, _id: crypto.randomUUID() }, ...prev].slice(0, 50));
  }, []);

  const sseStatus = useDomainEventStream(appendLog);

  const login = async () => {
    setError('');
    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setToken(data.accessToken);
      appendLog({
        type: 'ui',
        payload: { step: 'login', email },
        at: new Date().toISOString(),
      });
    } catch (e) {
      setError(e.message);
    }
  };

  const createDraft = async () => {
    setError('');
    try {
      const row = await apiCall('/product/create', {
        method: 'POST',
        token,
        body: { categoryId: getDemoCategoryId() },
      });
      setProductId(String(row.id));
      appendLog({
        type: 'ui',
        payload: { step: 'create_draft', id: row.id },
        at: new Date().toISOString(),
      });
    } catch (e) {
      setError(e.message);
    }
  };

  const addDetails = async () => {
    setError('');
    if (!productId) return;
    try {
      await apiCall(`/product/${productId}/details`, {
        method: 'POST',
        token,
        body: buildDemoDetailsBody(),
      });
      appendLog({
        type: 'ui',
        payload: { step: 'details_saved', id: productId },
        at: new Date().toISOString(),
      });
    } catch (e) {
      setError(e.message);
    }
  };

  const activate = async () => {
    setError('');
    if (!productId) return;
    try {
      await apiCall(`/product/${productId}/activate`, {
        method: 'POST',
        token,
      });
      appendLog({
        type: 'ui',
        payload: { step: 'activate_requested', id: productId },
        at: new Date().toISOString(),
      });
    } catch (e) {
      setError(e.message);
    }
  };

  const loadProduct = async () => {
    setError('');
    if (!productId) return;
    try {
      const data = await apiCall(`/product/${productId}`);
      setProductJson(data);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 720, margin: '1rem auto', padding: '0 1rem' }}>
      <h1>Demo API + eventos (SSE)</h1>
      <p>
        Usá un usuario con rol merchant o admin (p. ej. el admin del seed). El panel inferior muestra
        eventos del backend en tiempo casi real: <code>product.created</code> y{' '}
        <code>product.activated</code> llegan por Server-Sent Events cuando corrés el flujo.
      </p>
      <p>
        SSE: <strong>{sseStatus}</strong> — endpoint proxied <code>/events/stream</code>
      </p>

      {error ? (
        <p style={{ color: 'crimson' }} role="alert">
          {error}
        </p>
      ) : null}

      <section style={{ marginBottom: '1.5rem' }}>
        <h2>1. Login</h2>
        <label>
          Email{' '}
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: 240 }} />
        </label>
        <br />
        <label>
          Password{' '}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: 240 }}
          />
        </label>
        <br />
        <button type="button" onClick={login}>
          Login
        </button>
        {token ? <span style={{ marginLeft: 8 }}>Token OK</span> : null}
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h2>2. Producto (API REST)</h2>
        <button type="button" onClick={createDraft} disabled={!token}>
          Crear borrador (categoría 1)
        </button>
        <button type="button" onClick={addDetails} disabled={!token || !productId}>
          Guardar detalles (payload fijo demo)
        </button>
        <button type="button" onClick={activate} disabled={!token || !productId}>
          Activar
        </button>
        <button type="button" onClick={loadProduct} disabled={!productId}>
          GET producto
        </button>
        <p>
          <label>
            productId{' '}
            <input value={productId} onChange={(e) => setProductId(e.target.value)} size={6} />
          </label>
        </p>
        {productJson ? (
          <pre style={{ background: '#f4f4f4', padding: 8, overflow: 'auto' }}>
            {JSON.stringify(productJson, null, 2)}
          </pre>
        ) : null}
      </section>

      <section>
        <h2>3. Eventos (async / dominio → UI)</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {log.map((row) => (
            <li
              key={row._id}
              style={{
                borderBottom: '1px solid #ddd',
                padding: '6px 0',
                fontSize: 14,
              }}
            >
              <strong>{row.type}</strong>{' '}
              <span style={{ color: '#666' }}>{row.at}</span>
              <pre style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(row.payload ?? row, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
