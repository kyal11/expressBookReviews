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
    if (authUser) {
      return true
    }
    return false
  }
  return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
