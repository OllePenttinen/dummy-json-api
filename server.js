const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const TOKEN = process.env.API_TOKEN || "mysecret";

// Load entries from JSON
let entries = [];
try {
  entries = JSON.parse(fs.readFileSync('entries.json', 'utf8'));
} catch {
  entries = [];
}

// GET entries (no token needed, Glance fetches this)
app.get('/api/v1/entries.json', (req, res) => {
  res.json(entries);
});

// POST new entry (requires token)
app.post('/api/v1/entries.json', (req, res) => {
  const token = req.query.token || req.headers['authorization'];

  if (token !== TOKEN && token !== `Bearer ${TOKEN}`) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { sgv, date, direction } = req.body;

  if (!sgv || !date) {
    return res.status(400).json({ error: 'Missing sgv or date' });
  }

  const newEntry = {
    _id: `demo${entries.length + 1}`,
    sgv,
    direction: direction || "Flat",
    type: "sgv",
    date,
    dateString: new Date(date).toISOString()
  };

  entries.unshift(newEntry);
  entries = entries.slice(0, 30); // keep last 30
  fs.writeFileSync('entries.json', JSON.stringify(entries, null, 2));

  res.json({ status: 'ok', entry: newEntry });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));