const knex = require("knex")(require("../knexfile.ts"));
import express, { Express, NextFunction, Request, Response } from 'express';
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
const jwt = require("jsonwebtoken")

interface User {
    // id: number
    username: string
    password: string
    email:string
    timestamp: string
    avatar_url: string
}

interface UserAuthenticated extends Request {
    user: {
        // Define your user properties here
        id: number;
        username: string;
        password: string
        email:string
        timestamp: string
        avatar_url: string
        // ...
      };
}

const getUsers = async (req: Request, res: Response) => {
        
    try {

        const query: string = `select * from users`;
        const results = await knex.raw(query)
        console.log(results[0]);
        res.status(200).json(results[0]);


    } catch (err) {
        console.log(`${err}. Could not retrieve users`)
    }

}

const getUser = async (req: Request, res: Response) => {
    let userId = req.params.id;
    console.log(userId)
    const query: string = `select * from users where id = ${userId}`;
    knex.raw(query)
    .then((data: any) => {
        console.log(data[0][0])
        return res.status(200).json(data[0][0])
    })
    .catch((err: Error) => {
        console.log(`${err} here`)
    })
    // const results = await knex.raw(query) 

}

// sign up/register endpoint
const createUser = async(req: Request, res: Response) => {
    // const input = req.body;
    const {password, username, email} = req.body;
    let userFound: boolean = false
    if (password.length===0 || username.length===0 || email.length===0) {
        console.log("missing fields")
        return res.status(400).json("missing-fields")
    }

    const getUserQuery: string = 
    `SELECT * from users WHERE email = "${email}"`;
    // knex.raw(getUserQuery)
    // .then((data: any) => {
    //     if (data) {
    //         userFound = true
    //         console.log(data[0][0].email)
    //         console.log("User already exists")
    //         return res.status(400).json("user-exists")
    //     }
    // })
    // .catch ((err: Error) => {
    //     console.log(err)
    // })
    const isUserFound = await knex.raw(getUserQuery)
    console.log(isUserFound[0][0])
    if (isUserFound[0][0]) {
        console.log(isUserFound[0][0])
        userFound = true
        return res.status(200).json("user-exists")
    }
    if (userFound === false) {
        console.log(userFound)
        const query: string = 
            `INSERT INTO users (avatar_url,username,email,password) VALUES ("${"url4"}","${username}","${email}","${password}")`
    
        knex.raw(query)
        .then((data: User) => {
            res.status(200).send("Successfully created a new user")
        })
        .catch((err: Error) => {
            console.log(`${err}`)
    
        })                      
    }

}// end add user

// login endpoint
const login = async (req: Request, res: Response) => {
    const {password, email} = req.body;
    const secretKey = process.env.SECRET_KEY;
    // fields are not provided
    if (!password || !email) {
        return res.status(400).send("Please provide the user information")
    }
    // user does not exist

    const query: string = 
        `SELECT * from users WHERE email = "${email}" AND password = "${password}"`;

    // const user = await knex.raw(query)
    // console.log(user[0].id)
    await knex.raw(query)
    .then ((data: any) => {

        if (!data[0][0]) {
            console.log("here123131")
            return res.status(200).json({message: "invalid"});
        }
        // console.log(JSON.stringify(data[0].password))
        // console.log(JSON.parse(JSON.stringify(data[0])))
        console.log(data[0][0])
        const token = jwt.sign({ email, userId: data[0][0].id }, secretKey);
        console.log(token)
        res.json({ message: "Login successful", token, userId: data[0][0].id });

    })
    .catch((err: Error) => {
        console.log(err)
    })
    
}

// Middleware to authenticate requests
function authenticate(req: UserAuthenticated, res: Response, next: NextFunction) {

    const token = req.headers.authorization?.split(" ")[1];
    // const token = req.headers.authorization.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err: Error, decoded: any) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
        // req.user = decoded
        req.user = decoded;
        next();
    });
  }
  

module.exports = {
  getUsers,
  createUser,
  getUser,
  login,
  authenticate
};