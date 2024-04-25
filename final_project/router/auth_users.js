const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const user = users.find((user) => user.username === username);
  return user && user.password === password;
};

// only registered users can login (TASK 7)
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ username }, "access");
  req.session.authorization = {
    accessToken: token,
    username: username,
  };
  return res
    .status(200)
    .json({ message: "Login successful", username: username, token: token });
});

// Add a book review (TASK 8)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const user = req.session.authorization.username;
  const book = books[isbn];
  if (!book) {
    return res.status(404).send(`Book with ISBN ${isbn} not found`);
  }
  const userReview = book.reviews[user];
  if (userReview) {
    book.reviews[user] = review;
    return res
      .status(200)
      .send(
        `Review modified successfully for book with ISBN ${isbn}. \nBook details: ${JSON.stringify(
          book
        )}`
      );
  } else {
    book.reviews[user] = review;
    return res
      .status(200)
      .send(
        `Review added successfully for book with ISBN ${isbn}. \nBook details: ${JSON.stringify(
          book
        )}`
      );
  }
});

// Delete book review (TASK 9)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const user = req.session.authorization.username;
  const selectedBook = books[isbn];

  if (!selectedBook) {
    return res.status(404).send(`Book with ISBN ${isbn} not found`);
  }
  if (!selectedBook.reviews[user]) {
    return res.status(404).send(`Review not found for user ${user} `);
  }
  delete selectedBook.reviews[user];
  return res
    .status(200)
    .send(
      `Review deleted successfully. \nBook details: ${JSON.stringify(
        selectedBook
      )}`
    );
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
