module.exports = function(app) {
  // Mock API responses when the real backend is not available
  app.use("/api/*", (req, res, next) => {
    if (req.originalUrl.includes("/api/Config/ASF")) {
      return res.json({
        success: true,
        message: "ASF-UI is running in development mode without a backend"
      });
    }
    next();
  });

  // Mock Swagger response
  app.use("/swagger/*", (req, res, next) => {
    res.json({
      info: {
        title: "ASF API (Development Mode)",
        description: "Running in development mode without a backend"
      },
      paths: {}
    });
  });
};
