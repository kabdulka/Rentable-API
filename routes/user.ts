// const router = require("express").Router();
import express from "express"
const router = express.Router()
// const express = require("express")
// const router = express.Router()
require("dotenv").config();

const userController = require("../controllers/userController")

// import {getUsers, createUser} from "../controllers/userController"

const { getUsers, createUser, getUser, login, authenticate } = userController;


// GET
router.get("/", getUsers);
router.get("/:id", authenticate, getUser);

// POST
router.post("/register", createUser);
router.post("/login", login)

module.exports = router;