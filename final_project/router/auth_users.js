const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // stores user data (username and password)

// Check if the username is valid
const isValid = (username) => {
  return users.some(user => user.username === username); // checks if username already exists
};

// Authenticate user with username and password
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined; // checks if a matching user is found
};

// Middleware to authenticate user via JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user; // Attach the user object to the request
    next();
  });
};

// Login endpoint (Task 7)
regd_users.post("/customer/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user exists and the password is correct
  if (authenticatedUser(username, password)) {
    // Create a JWT token for the user
    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add or modify a book review (Task 8)
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const { username } = req.user;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Find the book by ISBN
  let book = books.find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already posted a review
  const existingReview = book.reviews.find(r => r.username === username);

  if (existingReview) {
    // Modify the existing review
    existingReview.review = review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    // Add a new review
    book.reviews.push({ username, review });
    return res.status(201).json({ message: "Review added successfully" });
  }
});

// Delete a book review (Task 9)
regd_users.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;

  // Find the book by ISBN
  let book = books.find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Find the index of the review posted by the user
  const reviewIndex = book.reviews.findIndex(r => r.username === username);

  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Delete the review
  book.reviews.splice(reviewIndex, 1);
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
