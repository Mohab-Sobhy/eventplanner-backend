
require('dotenv').config();
const UserRepo = require('./Model/repos/UserRepo')
const userRepo = new UserRepo();
const express = require('express')
const app = express()
const PORT = process.env.AUTH_SERVER_PORT;
app.use(express.json())

const jwt = require("jsonwebtoken");
const TokenRepo = require('./Model/repos/TokenRepo');
const tokenRepo = new TokenRepo();

app.post('/tokens', async (req, res) => {
    const refreshToken = req.body.token;

    if (!refreshToken) return res.sendStatus(401);

    const exists = await tokenRepo.tokenExists(refreshToken);
    if (!exists) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.username });
        res.json({ accessToken });
    });
});


app.delete('/logout',(req,res)=>{
    const refreshToken = req.body.token;
    tokenRepo.deleteToken(refreshToken);
    res.sendStatus(204);
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userRepo.getUser(email, password);
        if (!user || !user.id) return res.sendStatus(401);
        const accessToken = generateAccessToken({ username: user.username });
        const refreshToken = jwt.sign(
            { username: user.username },
            process.env.REFRESH_TOKEN_SECRET
        );
        await tokenRepo.addToken(user.id, refreshToken);
        res.json({
            accessToken,
            refreshToken
        });
    } catch (err) {
        console.error("Login error:", err);
        res.sendStatus(500);
    }
});


function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRY_TIME })
}

app.listen(PORT, () =>
    console.log(`authServer alive on ${PORT}`)
)