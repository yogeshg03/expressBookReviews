const express = require('express');
const axios = require('axios'); // Import axios for making HTTP requests
let books = require("./booksdb.js"); // Assuming booksdb.js contains the local book data
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const booksApiUrl = 'http://localhost:5000/books'; // The URL where books are fetched from

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(booksApiUrl);  // Fetch books list
    res.json(response.data);  // Send the book list as a JSON response
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 10: Get the book list available in the shop using Promise callbacks
public_users.get('/callback', function (req, res) {
  axios.get(booksApiUrl)
    .then(response => {
      res.json(response.data);  // Send the book list as a JSON response
    })
    .catch(error => {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Error fetching books", error: error.message });
    });
});

// Task 11: Get the book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    const response = await axios.get(`${booksApiUrl}/isbn/${isbn}`);  // Fetch book by ISBN
    res.json(response.data);  // Send the book details as a JSON response
  } catch (error) {
    console.error("Error fetching book by ISBN:", error);
    res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// Task 11: Get the book details based on ISBN using Promise callbacks
public_users.get('/isbn/callback/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  axios.get(`${booksApiUrl}/isbn/${isbn}`)  // Fetch book by ISBN
    .then(response => {
      res.json(response.data);  // Send the book details as a JSON response
    })
    .catch(error => {
      console.error("Error fetching book by ISBN:", error);
      res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
    });
});

// Task 12: Get the book details based on Author using async-await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    const response = await axios.get(`${booksApiUrl}/author/${author}`);  // Fetch books by author
    res.json(response.data);  // Send the books by the author as a JSON response
  } catch (error) {
    console.error("Error fetching books by author:", error);
    res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Task 12: Get the book details based on Author using Promise callbacks
public_users.get('/author/callback/:author', function (req, res) {
  const author = req.params.author;
  
  axios.get(`${booksApiUrl}/author/${author}`)  // Fetch books by author
    .then(response => {
      res.json(response.data);  // Send the books by the author as a JSON response
    })
    .catch(error => {
      console.error("Error fetching books by author:", error);
      res.status(500).json({ message: "Error fetching books by author", error: error.message });
    });
});

// Task 13: Get the book details based on Title using async-await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  
  try {
    const response = await axios.get(`${booksApiUrl}/title/${title}`);  // Fetch books by title
    res.json(response.data);  // Send the books by the title as a JSON response
  } catch (error) {
    console.error("Error fetching books by title:", error);
    res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

// Task 13: Get the book details based on Title using Promise callbacks
public_users.get('/title/callback/:title', function (req, res) {
  const title = req.params.title;
  
  axios.get(`${booksApiUrl}/title/${title}`)  // Fetch books by title
    .then(response => {
      res.json(response.data);  // Send the books by the title as a JSON response
    })
    .catch(error => {
      console.error("Error fetching books by title:", error);
      res.status(500).json({ message: "Error fetching books by title", error: error.message });
    });
});

// Register endpoint for user registration
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (users.hasOwnProperty(username)) {
    return res.status(400).json({ message: "Username already exists." });
  }

  users[username] = { password };
  return res.status(201).json({ message: "User successfully registered.", user: { username } });
});

module.exports.general = public_users;
