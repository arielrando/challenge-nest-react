/**
 * Valores por defecto del demo cargados desde variables VITE_* (definidas en el .env de la raíz del repo).
 * Nota: todo lo que empiece por VITE_ se expone en el bundle del navegador — no uses secretos reales.
 */
export function buildDemoDetailsBody() {
  return {
    title: import.meta.env.VITE_DEMO_TITLE || 'Producto demo',
    code: import.meta.env.VITE_DEMO_CODE || 'DEMO-FE-001',
    variationType: import.meta.env.VITE_DEMO_VARIATION_TYPE || 'NONE',
    details: {
      category: import.meta.env.VITE_DEMO_DETAIL_CATEGORY || 'Computers',
      capacity: Number(import.meta.env.VITE_DEMO_DETAIL_CAPACITY) || 512,
      capacityUnit: import.meta.env.VITE_DEMO_DETAIL_CAPACITY_UNIT || 'GB',
      capacityType: import.meta.env.VITE_DEMO_DETAIL_CAPACITY_TYPE || 'SSD',
      brand: import.meta.env.VITE_DEMO_DETAIL_BRAND || 'Acme',
      series: import.meta.env.VITE_DEMO_DETAIL_SERIES || 'X1',
    },
    about: [
      import.meta.env.VITE_DEMO_ABOUT_LINE ||
        'Demostración punta a punta',
    ],
    description:
      import.meta.env.VITE_DEMO_DESCRIPTION ||
      'Creado desde el frontend de prueba',
  };
}

export function getDemoCategoryId() {
  const n = Number(import.meta.env.VITE_DEMO_CATEGORY_ID);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
