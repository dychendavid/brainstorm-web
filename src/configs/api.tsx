const API_BASE = process.env.NEXT_PUBLIC_API_URL;
export const API = {
  PRODUCTS: `${API_BASE}/api/v1/products`,
  PRODUCT_AVAILABLE: `${API_BASE}/api/v1/products/available`,
  PRODUCT_GPT: `${API_BASE}/api/v1/products/intro_gpt`,
  AUTHORIZE: `${API_BASE}/api/v1/authorize`,
};
