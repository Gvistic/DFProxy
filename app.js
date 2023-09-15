import express from 'express';
import request from 'request';
import NodeCache from 'node-cache';

const app = express();
const port = 5001;
const apiCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

app.get('/bundles/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const { limit, cursor } = req.query;
  const cacheKey = `user:${userId}:limit:${limit}:cursor:${cursor}`;

  // Check cache
  const cacheContent = apiCache.get(cacheKey);
  if (cacheContent) {
    return res.send(cacheContent);
  }

  let url = `https://catalog.roproxy.com/v1/users/${userId}/bundles?limit=${limit}&sortOrder=Asc`;
  if (cursor) url += `&cursor=${cursor}`;
  
  request(url, (err, response, body) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Save to cache
    apiCache.set(cacheKey, body);

    res.send(body);
  });
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`);
});
