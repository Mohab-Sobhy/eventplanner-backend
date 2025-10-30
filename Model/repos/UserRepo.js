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
}

module.exports = UserRepo;