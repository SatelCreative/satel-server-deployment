/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

const { SERVER_PORT } = process.env;

module.exports = (app) => {
  app.use(
    ['/pim', '/schema', '/mongomodels', '/api'],
    createProxyMiddleware({
      target: `http://localhost:${SERVER_PORT}`,
      changeOrigin: true,
    }),
  );
};
