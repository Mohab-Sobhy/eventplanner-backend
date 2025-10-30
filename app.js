require("dotenv").config();
const UserRepo = require('./Model/repos/UserRepo')
const userRepo = new UserRepo();
const express = require('express');
const { validationResult } = require('express-validator');
const { registerValidator } = require('./Validators/registerValidator');
const app = express()
const PORT = process.env.APP_PORT;
app.use(express.json())
///////////Users///////////////////////////
app.post('/users/register', async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'missing required values' });
    }
    try {
        await userRepo.addUser(username, email, password)
        return res.status(201).json({ message: `user is added` })
    }
    catch (ex) {
        return res.status(400).json({ error: ex.message });
    }
})
///////////Users///////////////////////////
///////////////////////////////////////////
const jwt = require("jsonwebtoken");
function authenticate(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null)return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err)return res.sendStatus(403)
        req.user = user;
        next()
    })
}
app.listen(PORT, () =>
    console.log(`it's alive on http://localhost:${PORT}`)
)