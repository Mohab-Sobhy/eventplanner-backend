const UserRepo = require('./Model/repos/UserRepo')
const userRepo = new UserRepo();
const express = require('express')
const app = express()
const PORT = 8080;
app.use(express.json())
///////////Users///////////////////////////
app.post('/users/register', async (req, res) => {
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
app.listen(PORT, () =>
    console.log(`it's alive on http://localhost:${PORT}`)
)