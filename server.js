import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'cfba98e377664fd3901e0897946a56dc';

app.use(cors());

app.get('/api/news', async (req, res) => {
  try {
    const { q, category, page } = req.query;

    const endpoint = q ? 'everything' : 'top-headlines';
    const url = `https://newsapi.org/v2/${endpoint}?country=us&pageSize=15&page=${page || 1}&category=${category || ''}&q=${q || ''}&apiKey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
