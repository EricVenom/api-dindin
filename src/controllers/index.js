const pool = require('../services/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtPassword = require('../jwtpass');

const signUp = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(401).json({ mensagem: "Todos os campos são obrigatórios." })
    }

    try {
        const verifyEmail = await pool.query('select * from usuarios where email = $1', [email])

        if (verifyEmail.rowCount) {
            return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." });
        }

        const encryptedPassword = await bcrypt.hash(senha, 10);

        await pool.query('insert into usuarios (nome, email, senha) values ($1, $2, $3)', [nome, email, encryptedPassword]);
        const { rows } = await pool.query('select * from usuarios where email = $1', [email])
        const { senha: _, ...user } = rows[0]

        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const signIn = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Informe seus dados corretamente." });
    }

    try {
        const user = await pool.query('select * from usuarios where email = $1', [email]);

        if (!user.rowCount) {
            return res.status(401).json({ mensagem: "Email ou senha inválida." });
        };

        const validPassword = await bcrypt.compare(senha, user.rows[0].senha);

        if (!validPassword) {
            return res.status(401).json({ mensagem: "Email ou senha inválida." });
        };

        const token = jwt.sign({ id: user.rows[0].id }, jwtPassword, { expiresIn: '8h' });
        const { senha: _, ...loggedUser } = user.rows[0]

        return res.json({ user: loggedUser, token });
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
};



module.exports = { signUp, signIn }