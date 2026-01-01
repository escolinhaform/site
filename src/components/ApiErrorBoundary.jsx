import React from 'react';

const ApiErrorBoundary = ({ children }) => {
  const checkApiConfig = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

    return {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!anonKey,
      hasServiceKey: !!serviceKey,
      isProduction: import.meta.env.PROD
    };
  };

  const config = checkApiConfig();

  // Se estiver em produção e faltar alguma variável, mostrar erro
  if (config.isProduction && (!config.hasUrl || !config.hasAnonKey || !config.hasServiceKey)) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        backgroundColor: '#fee', 
        border: '1px solid #fcc',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2 style={{ color: '#c00' }}>⚠️ Erro de Configuração da API</h2>
        <p>As variáveis de ambiente não estão configuradas corretamente no deploy.</p>
        
        <div style={{ textAlign: 'left', backgroundColor: '#fff', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
          <h4>Verifique no Netlify:</h4>
          <ul>
            <li style={{ color: config.hasUrl ? 'green' : 'red' }}>
              {config.hasUrl ? '✅' : '❌'} VITE_SUPABASE_URL
            </li>
            <li style={{ color: config.hasAnonKey ? 'green' : 'red' }}>
              {config.hasAnonKey ? '✅' : '❌'} VITE_SUPABASE_ANON_KEY
            </li>
            <li style={{ color: config.hasServiceKey ? 'green' : 'red' }}>
              {config.hasServiceKey ? '✅' : '❌'} VITE_SUPABASE_SERVICE_KEY
            </li>
          </ul>
        </div>

        <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
          Vá para <strong>Site settings → Build & deploy → Environment</strong> no painel do Netlify
          e adicione as variáveis de ambiente acima.
        </p>
      </div>
    );
  }

  return children;
};

export default ApiErrorBoundary;
