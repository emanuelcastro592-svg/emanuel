// Configuração do PM2 para gerenciar servidor e cliente
module.exports = {
  apps: [
    {
      name: 'servidor-api',
      script: 'server/index.js',
      cwd: './',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      error_file: './logs/servidor-error.log',
      out_file: './logs/servidor-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'cliente-react',
      script: 'npm',
      args: 'start',
      cwd: './client',
      interpreter: 'npm',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        BROWSER: 'none',
        REACT_APP_API_URL: 'http://localhost:5000/api'
      },
      error_file: '../logs/cliente-error.log',
      out_file: '../logs/cliente-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};


