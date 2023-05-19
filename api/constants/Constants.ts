const Constants = {
  HOSTNAME: process.env.HOSTNAME || 'http://localhost',
  API_PORT: process.env.API_PORT || 3004,
  TESTING: process.env.TESTING || false,
  BACKEND_URL: process.env.BACKEND_URL || '',
  FRONTEND_URL: process.env.FRONTEND_URL || ''
};

export default Constants;
