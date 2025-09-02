
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const { method, url } = req;
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${method} ${url} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
};

module.exports = loggerMiddleware;
