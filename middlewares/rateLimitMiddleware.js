



async function rateLimiteMiddleware(client,req, res, next) {
  const requestLimit = 1000;
  const expirationTime = 40; // seconds

  try {
    const url = req.originalUrl;
    const ip = req.ip;
    const key = `resource:${url}:userIP:${ip}`;

    const requestCount = Number((await client.get(key)) || 0) + 1;

    if (requestCount <= requestLimit - 1) {
      await client.set(key, requestCount, { EX: expirationTime });
      next()
    } else {
      return res.status(429).end();
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error).end();
  }

}

module.exports = rateLimiteMiddleware