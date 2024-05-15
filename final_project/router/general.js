const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  new Promise((resolve, reject) => {
    if (!username || !password) {
      return reject("Username and password are required");
    }
    if (isValid(username)) {
      return reject("Username already exists");
    } else {
      resolve({ username, password });
    }
  })
  .then(user => {
    users.push(user);
    res.status(201).json({ "status": true, "message": `${user.username} registered successfully.` });
  })
  .catch(err => {
    res.status(400).json({ "status": false, "message": err });
  });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    if (books != null) {
      resolve(books)
    } else {
      reject("No books found !")
    }
  }).then((books) => {res.status(200).json({"status": true, "message": "Successful get books data", "data": books, "users": users})})
    .catch((err) => { res.status(403).json(err)})
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn)

  new Promise((resolve, reject) => {
    let isbnBook = books[isbn]

    if (isbnBook) {
      resolve(isbnBook)
    } else {
      reject("No books Found")
    }
  }).then((book) => {res.status(200).json({"status": true, "message": "Successful get book data", "data": book})})
    .catch((err) => {res.status(403).json({"status": false, "message": "Failed get book data", "error":err})})
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author

  new Promise((resolve, reject) => {

    let bookFilterAuthor = Object.values(books).filter(book => book.author === author);

    if (bookFilterAuthor.length > 0) {
      resolve(bookFilterAuthor)
    } else {
      reject("No book found")
    }
  }).then((book) => {res.status(200).json({"status": true, "message": "Successful get book data", "data": book})})
    .catch((err) => {res.status(403).json({"status": false, "message": "Failed get book data", "error":err})})

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title

  new Promise((resolve, reject) => {

    let bookFilterTitle = Object.values(books).filter(book => book.title === title);

    if (bookFilterTitle.length > 0) {
      resolve(bookFilterTitle)
    } else {
      reject("No book found")
    }
  }).then((book) => {res.status(200).json({"status": true, "message": "Successful get book data", "data": book})})
    .catch((err) => {res.status(403).json({"status": false, "message": "Failed get book data", "error":err})})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn)

  new Promise((resolve, reject) => {
    let isbnReview = books[isbn]

    if (isbnReview) {
      resolve(isbnReview)
    } else {
      reject("Not book found !")
    }
  }).then((isbnReview) => res.status(200).json({"status": true, "message": "Successful get review book data", "reviews": isbnReview.reviews}))
    .catch((err) => {res.status(403).json({"status": false, "message": "Failed get book data", "error":err})})
});

module.exports.general = public_users;
