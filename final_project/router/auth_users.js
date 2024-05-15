const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let validUser = users.filter((user) => user.username === username);
  if (validUser.length > 0) {
    return true;
  } 
  return false;
};


const authenticatedUser = (username,password)=>{ 
  if (isValid(username)) {
    let authUser = users.filter( user => (user.username === username) && (user.password === password))
    if (authUser.length > 0) {
      return true
    }
    return false
  }
  return false
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ "status": false, "message": "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ "status": false, "message": "Invalid username or password" });
  }

  let accessToken = jwt.sign({ data: username }, "access", { expiresIn: '1h' });

  req.session.authorization = { accessToken, username };

  res.status(200).json({ "status": true, "message": "Login successful", "accessToken": accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!books[isbn]) {
    return res.status(400).json({ "status": false, "message": "Book not found" });
  }
  if (!review) {
    return res.status(400).json({ "status": false, "message": "Review is empty!" });
  }

  books[isbn].reviews[username] = review;
  res.status(200).json({ "status": true,"message": "Book review updated." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user= req.session.authorization.username;
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(400).json({ "status": false, "message": "Book not found" });
  } else if (!books[isbn].reviews[user]) {
    return res.status(400).json({ "status": false, "message": `${user} have never reviewed this book` });
  }
  delete books[isbn].reviews[user];
  res.status(200).json({ "status": true, "message": `Book review by ${user} deleted.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
