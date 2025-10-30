const bcrypt = require('bcrypt');
const client = require('./databasepg');

class TokenRepo {
    async addToken(userId, token) {
        console.log("UserId: ", userId);
        await client.query(
            `INSERT INTO Tokens (user_id, token) VALUES ($1,$2)`,
            [userId, token]
        );
    }
    async deleteToken(token) {
        await client.query(
            `delete from Tokens WHERE token = $1`,
            [token]
        );
    }
    async tokenExists(token) {
        const result = await client.query(
            `SELECT * FROM Tokens WHERE token = $1`,
            [token]
        );
        return result.rows.length > 0;
    }
}

module.exports = TokenRepo;