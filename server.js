const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// Load entries from JSON
let entries = JSON.parse(fs.readFileSync('entries.json', 'utf8'));

// GET entries
app.get('/entries.json', (req, res) => {
  res.json(entries);
});

// POST new entry
app.post('/entries.json', (req, res) => {
  const newEntry = req.body;
  if (!newEntry || !newEntry.value || !newEntry.timestamp) {
    return res.status(400).json({ error: 'Invalid entry' });
  }
  newEntry._id = `demo${entries.length + 1}`;
  entries.push(newEntry);
  fs.writeFileSync('entries.json', JSON.stringify(entries, null, 2));
  res.json({ status: 'ok', entry: newEntry });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
