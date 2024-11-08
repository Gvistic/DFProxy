import express from 'express';
import request from 'request';
import NodeCache from 'node-cache';

const app = express();
const port = 5001;
const apiCache = new NodeCache({ stdTTL: 600, checkperiod: 600 }); // Set a longer TTL

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

    if (response.statusCode === 200) { // Only cache successful responses
      // Save to cache
      apiCache.set(cacheKey, body);
    }

    res.send(body);
  });
});

// create a get for getting outfits given user id
app.get('/outfits/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { page, itemsPerPage, outfitType } = req.query;
  const cacheKey = `user:${userId}:outfits:page:${page}:itemsPerPage:${itemsPerPage}:outfitType:${outfitType}`;

  console.log("received request", req.query);

  // Check cache
  const cacheContent = apiCache.get(cacheKey);
  if (cacheContent) {
    console.log('cache hit');
    console.log(cacheContent);
    return res.send(cacheContent);
  }

  //let url = `https://avatar.roblox.com/v1/users/${userId}/outfits?outfitType=${outfitType || 'All'}&page=${page || 1}&itemsPerPage=${itemsPerPage || 25}&isEditable=true`;
  let url = `https://avatar.roblox.com/v1/users/${userId}/outfits?page=${page || 1}`;

  request(url, (err, response, body) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (response.statusCode === 200) { // Only cache successful responses
      // Save to cache
      apiCache.set(cacheKey, body);
    }

    res.send(body);
  });
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`);
});
