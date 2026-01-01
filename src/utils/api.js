// Configuração da API com fallback
const getApiConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

  // Verificar se as variáveis de ambiente estão disponíveis
  if (!supabaseUrl || !anonKey || !serviceKey) {
    console.error('Variáveis de ambiente da API não configuradas');
    return null;
  }

  return {
    supabaseUrl,
    anonKey,
    serviceKey
  };
};

// Função wrapper para fetch com tratamento de erro
export const apiFetch = async (url, options = {}) => {
  const config = getApiConfig();
  
  if (!config) {
    throw new Error('API não configurada. Verifique as variáveis de ambiente.');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders
  });

  // Verificar se a resposta é HTML (erro de roteamento)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    throw new Error('Erro de configuração da API. Verifique as variáveis de ambiente no deploy.');
  }

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
  }

  return response;
};

export const getApiUrl = (endpoint) => {
  const config = getApiConfig();
  if (!config) return null;
  return `${config.supabaseUrl}/rest/v1/${endpoint}`;
};

export const getApiHeaders = (useServiceKey = false) => {
  const config = getApiConfig();
  if (!config) return {};
  
  const key = useServiceKey ? config.serviceKey : config.anonKey;
  
  return {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  };
};
