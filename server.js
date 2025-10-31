require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.AUTH_SERVER_PORT;

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/auth', authRoutes);
app.use('/user', userRoutes)


app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
