import pool from './database'

class User {
    email: string
    username: string
    password: string
    site_from: number

    constructor(email: string, username: string, password: string, site_from: number) {
        this.email = email
        this.username = username
        this.password = password
        this.site_from = site_from
    }

    findOne = async (email: string) => {
        const query = `SELECT * FROM users WHERE email = $1`
        const values = [email]
        const { rows } = await pool.query(query, values)

        return rows[0]
    }

    save = async () => {
        const query = `INSERT INTO users (email, username, password, site_from) VALUES ($1, $2, $3, $4)`
        const values = [this.email, this.username, this.password, this.site_from]

        await pool.query(query, values)
    }

    fromSite = async (email: string) => {
        const query = `SELECT site_from FROM users WHERE email = $1 LIMIT 1`
        const { rows } = await pool.query(query, [email]) // Pass email inside an array

        return rows[0]?.site_from // Use optional chaining to avoid errors if rows[0] is undefined
    }


}

export default User;
