const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/loadData/*",
    createProxyMiddleware({
      target: "http://backend:5000",
      changeOrigin: true,
      secure: false
    })
  );
  app.use(
    "/perturb/*",
    createProxyMiddleware({
      target: "http://backend:5000",
      changeOrigin: true,
      secure: false
    })
  );
};

// "proxy": "http://backend:5000",
