const UserRepo = require('../Model/repos/UserRepo')
const userRepo = new UserRepo();
const express = require('express')

const jwt = require("jsonwebtoken");
const TokenRepo = require('../Model/repos/TokenRepo');
const tokenRepo = new TokenRepo();

const { validationResult } = require('express-validator');

//This function creates a user and adds him to database and also validates
exports.register = async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'missing required values' });
    }
    try {
        await userRepo.addUser(username, email, password, role='admin')
        return res.status(201).json({ message: `user is added` })
    }
    catch (ex) {
        return res.status(400).json({ error: ex.message });
    }
}


function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY_TIME
  });
}

//This function logs in user and creates a refresh and an access token and saves the refresh token to db
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userRepo.getUser(email, password);
    if (!user || !user.id) return res.sendStatus(401);

    const accessToken = generateAccessToken({ username: user.username, role: user.role });
    const refreshToken = jwt.sign(
      { 
        username: user.username, 
        role: user.role
      },
      process.env.REFRESH_TOKEN_SECRET
    );

    await tokenRepo.addToken(user.id, refreshToken);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error("Login error:", err);
    res.sendStatus(500);
  }
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  try {
    const exists = await tokenRepo.tokenExists(refreshToken);
    if (!exists) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({
        username: user.username,
        role: user.role,
      });
      res.json({ accessToken });
    });
  } catch (err) {
    console.error("Error refreshing token:", err);
    res.status(500).json({ message: "Server error while refreshing token" });
  }
};

//This function deletes the refresh token from the database
exports.logout = async (req, res) => {
  const refreshToken = req.body.token;
  await tokenRepo.deleteToken(refreshToken);
  res.sendStatus(204);
};