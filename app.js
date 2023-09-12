const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const uuid = require('uuid');


const app = express();
const port = 3000;

app.use(bodyParser.json());

//Validation: Implementation of input validation to ensure data integrity and security
app.post('/createUser', (req, res) => {
  const { username, email, password } = req.body;
  
  // Validate username (must be at least 5 characters)
  if (!username || username.length <5) {
    return res.status(400).json({ error: 'Username must be at least 5 characters long' });
  }
  // Validate email (must be a valid email format)
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Validate password (must be at least 8 characters)
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  // If all validations pass, you can proceed to create the user
  const newUser = {
    username,
    email,
    password, // Remember to hash the password before storing it
  };

  // Here, you would typically store the user in your data storage (e.g., a database)

  res.status(201).json({ message: 'User created successfully', user: newUser });
});

function isValidEmail(email) {
  // Basic email validation regex (you can use a more sophisticated one)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};


// Sample data store (replace with preferred data storage)
const items = [
    { name: "Alice", age: 30, id:1 },
    { name: "Bob", age: 25, id:2},
    { name: "Charlie", age: 35, id:3 }
  ];
  

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(chalk.yellow(`Received ${req.method} request at ${req.path}`));
  next();
});


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
  //console.log(typeof itemId); 

  const item = items.find((i) => i.id == itemId);

  if (!item) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    res.json(item);
  }
});

app.get('/', (req, res) => {
  res.end('welcome home');
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(chalk.red(`Error: ${err.message}`));
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(port, () => {
  console.log(chalk.blue(`Server is running on port ${port}`));
})
