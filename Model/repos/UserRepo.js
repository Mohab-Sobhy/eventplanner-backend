const bcrypt = require('bcrypt');
const client = require('./databasepg');

class UserRepo {
    async addUser(username, email, password) {

        const hashedPassword = await bcrypt.hash(password, 10);

        await client.query(
            `INSERT INTO Users (username,email,password)
                 values ($1,$2,$3)`,
            [username, email, hashedPassword]
        );
    }
    async getUser(email, password) {
        const result = await client.query(
            `SELECT id, username, email, password 
            FROM Users 
            WHERE email = $1`,
            [email]
        );
        if (result.rows.length === 0) {
            throw new Error("User not found");
        }
        const user = result.rows[0];
        console.log("Password input:", password);
        console.log("Stored hash:", user.id);
        if (!password || !user.password) {
            throw new Error("Missing password data for comparison");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }
        return { id: user.id, username: user.username, email: user.email };
    }
}

module.exports = UserRepo;