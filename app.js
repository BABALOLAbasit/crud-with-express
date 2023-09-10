const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const uuid = require('uuid');



const app = express();
const port  = 3000;

app.use(bodyParser.json());

// Sample data store (replace with preferred data storage)
const items = [];


// Create route to add new items to the collection (POST)
app.post('/items', (req, res) => {
  const newItem = req.body;
  newItem.id = uuid.v4(); // Generate a unique ID for the item
  items.push(newItem);
  res.status(201).json(newItem);
});

// Read route to retrieve all items (GET)
app.get('/items', (req, res) => {
  res.json(items);
});

// Read route to retrieve a specific item by ID (GET)
app.get('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const item = items.find((i) => i.id === itemId);

  if (!item) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    res.json(item);
  }
});

// Update route to update an item by ID (PUT)
app.put('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;
  const index = items.findIndex((i) => i.id === itemId);

  if (index === -1) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    items[index] = updatedItem;
    res.json(updatedItem);
  }
});

// Delete route to delete an item by ID (DELETE)
app.delete('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const index = items.findIndex((i) => i.id === itemId);

  if (index === -1) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    items.splice(index, 1);
    res.sendStatus(204);
  }
});


app.listen(port, () => {
  console.log(chalk.blue(`Server is running on port ${port}`));
});
