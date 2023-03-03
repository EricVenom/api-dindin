const pool = require('../services/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtPassword = require('../jwtpass');

function checkReqs(...reqs) {
    return reqs.some((req) => !req)
};

const signUp = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (checkReqs(nome, email, senha)) {
        return res.status(401).json({ mensagem: "Todos os campos são obrigatórios." })
    };

    try {
        const { rowCount } = await pool.query('select * from usuarios where email = $1', [email])

        if (rowCount) {
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
};

const signIn = async (req, res) => {
    const { email, senha } = req.body;

    if (checkReqs(email, senha)) {
        return res.status(400).json({ mensagem: "Informe seus dados corretamente." });
    };

    try {
        const { rows, rowCount } = await pool.query('select * from usuarios where email = $1', [email]);

        if (!rowCount) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." });
        };

        const validPassword = await bcrypt.compare(senha, rows[0].senha);

        if (!validPassword) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." });
        };

        const token = jwt.sign({ id: rows[0].id }, jwtPassword, { expiresIn: '8h' });
        const { senha: _, ...loggedUser } = rows[0]

        return res.json({ usuario: loggedUser, token });
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const showUser = async (req, res) => {
    try {
        const { id } = req.userId;

        const { rows } = await pool.query('select * from usuarios where id = $1', [id]);
        const { senha: _, ...user } = rows[0];
        return res.json({ ...user })
    } catch (error) {
        return res.status(401).json({ mensagem: "Usuário não autenticado." })
    }
};

const updateUser = async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(401).json({ mensagem: "Informe todos os campos." })
    };

    try {
        const { id } = req.userId;
        const encryptedPassword = await bcrypt.hash(senha, 10);

        const { rowCount } = await pool.query('select * from usuarios where email = $1', [email]);
        if (rowCount) {
            return res.status(401).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." })
        }

        await pool.query('update usuarios set nome = $1, email = $2, senha = $3 where id = $4', [nome, email, encryptedPassword, id])
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." })
    }
};

const showCategories = async (req, res) => {

}

module.exports = { signUp, signIn, showUser, updateUser, showCategories }