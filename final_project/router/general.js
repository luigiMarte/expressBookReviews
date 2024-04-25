const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  //Write your code here (TASK 6)
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res
      .status(409)
      .json({ message: `Username ${username} already exists` });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop (TASK 1)

/* public_users.get('/',function (req, res) {
    const bookList = Object.values(books).map(book => {
        return {
            author: book.author,
            title: book.title,
            review :book.reviews
        };
    });
    return res.status(200).send(JSON.stringify(bookList, null, 4));
}); */

// Get the book list available in the shop
// Using Promise callbacks or async-await with Axios ( TASK 10 )
public_users.get("/", function (req, res) {
  const getBookList = new Promise((resolve, reject) => {
    try {
      const bookList = Object.values(books).map((book) => {
        return {
          author: book.author,
          title: book.title,
          review: book.reviews,
        };
      });
      resolve(bookList);
    } catch (error) {
      reject(error);
    }
  });

  getBookList
    .then((bookList) => {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
      return res.status(500).send("Error when gettin books list", error);
    });
});

// Get book details based on ISBN (TASK 2)

/* public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; 
    if(books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    } 
}); */

// Get book details based on ISBN
// Using Promise callbacks or async-await with Axios (TASK 11)
public_users.get("/isbn/:isbn", function (req, res) {
  const getBookByISBN = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(`Book with ISBN ${isbn} not found`);
    }
  });

  getBookByISBN
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get book details based on author (TASK 3)
/* public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase(); 
  const booksArray = Object.values(books); 
  const booksByAuthor = booksArray.filter(book => book.author.toLowerCase() === author); 
  if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
  } else {
      res.status(404).json({ message: `No books found for author: ${req.params.author}` });
  }
}); */

// Get book details based on author
// Using Promise callbacks or async-await with Axios ( TASK 12 )
public_users.get("/author/:author", function (req, res) {
 const getBooksByAuthor = new Promise((resolve, reject) => {
    // Simulate 2 seconds delay before resolve promise
    setTimeout(() => {
      const author = req.params.author.toLowerCase();
      const booksArray = Object.values(books);
      const booksByAuthor = booksArray.filter(
        (book) => book.author.toLowerCase() === author
      );
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(`No books found for author: ${req.params.author}`);
      }
    }, 2000)
  });

  getBooksByAuthor
    .then((books) => {
      return res.status(200).json(books);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get all books based on title (TASK 4)
/* public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title.toLowerCase(); 
  const booksArray = Object.values(books);
  const booksByTitle = booksArray.filter(book => book.title.toLowerCase() === title); 
  if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
  } else {
      res.status(404).json({ message: `No books found for title: ${req.params.title}` });
  }
}); */

// Get all books based on title
// Using Promise callbacks or async-await with Axios (TASK 13)
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title.toLowerCase();
    // Simulate an API call with Axios to get all books data
    const response = await axios.get("http://localhost:5000/");
    const booksArray = response.data;
    const booksByTitle = booksArray.filter(
      (book) => book.title.toLowerCase() === title
    );

    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      throw `No books found for title: ${req.params.title}`;
    }
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

//  Get book review (TASK 5)
public_users.get("/review/:isbn", function (req, res) {
  const isbnToFind = req.params.isbn;
  if (books[isbnToFind]) {
    return res.status(200).json(books[isbnToFind].reviews);
  } else {
    return res
      .status(404)
      .json({ message: `Book with isbn ${isbnToFind} not found ` });
  }
});

module.exports.general = public_users;
