const pool = require('../services/connection');
const bcrypt = require('bcrypt');

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
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}

module.exports = { signUp }