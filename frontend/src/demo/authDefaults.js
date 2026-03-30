/**
 * Valores iniciales del formulario (solo comodidad local). VITE_* va al bundle del cliente.
 */
export function getDemoLoginDefaults() {
  return {
    email: import.meta.env.VITE_DEMO_DEFAULT_EMAIL || '',
    password: import.meta.env.VITE_DEMO_DEFAULT_PASSWORD || '',
  };
}
