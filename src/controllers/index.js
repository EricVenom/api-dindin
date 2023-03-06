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

        const { rows } = await pool.query('insert into usuarios (nome, email, senha) values ($1, $2, $3) returning id, nome, email', [nome, email, encryptedPassword]);

        return res.status(201).json(rows[0]);
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
    if (checkReqs(nome, email, senha)) {
        return res.status(401).json({ mensagem: "Informe todos os campos." })
    };

    try {
        const { id } = req.userId;
        const encryptedPassword = await bcrypt.hash(senha, 10);

        const { rowCount, rows } = await pool.query('select * from usuarios where email = $1', [email]);
        if (rowCount && rows[0].id !== id) {
            return res.status(401).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." })
        }

        await pool.query('update usuarios set nome = $1, email = $2, senha = $3 where id = $4', [nome, email, encryptedPassword, id])
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." })
    }
};

const showCategories = async (req, res) => {
    try {
        const query = 'SELECT * FROM categorias';

        const { rowCount, rows } = await pool.query(query);

        if (!rowCount) {
            return res.status(400).json({ mensagem: "Dados não encontrados" })
        }
        return res.status(200).json(rows);

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const showTransactions = async (req, res) => {
    const { id } = req.userId;
    try {
        const query = 'SELECT transacoes.id, transacoes.tipo, transacoes.descricao, transacoes.valor, transacoes.data,\
        transacoes.usuario_id, transacoes.categoria_id, categorias.descricao AS categoria_nome\
        FROM transacoes\
        JOIN categorias ON transacoes.categoria_id = categorias.id  WHERE usuario_id = $1';

        const { rows: userTransactions, rowCount } = await pool.query(query, [id]);
        if (!rowCount) {
            return res.status(200).json([]);
        }

        return res.json(userTransactions)
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
};

const showTransactionsById = async (req, res) => {
    const { id } = req.userId;
    const { id: transactionId } = req.params;
    try {
        const query = 'SELECT transacoes.id, transacoes.tipo, transacoes.descricao, transacoes.valor, transacoes.data,\
        transacoes.usuario_id, transacoes.categoria_id, categorias.descricao AS categoria_nome\
        FROM transacoes\
        JOIN categorias ON transacoes.categoria_id = categorias.id  WHERE usuario_id = $1 AND transacoes.id = $2';

        const { rows: userTransactions, rowCount } = await pool.query(query, [id, transactionId]);
        if (!rowCount) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' })
        }

        return res.json(userTransactions)
    } catch (error) {
        return res.status(404).json({ mensagem: 'Transação não encontrada.' })
    }
};

const addNewTransaction = async (req, res) => {
    try {
        const { id } = req.userId;
        const { descricao, valor, data, categoria_id, tipo } = req.body;

        if (checkReqs(descricao, valor, data, categoria_id, tipo)) {
            return res.status(401).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' });
        }

        const { rowCount, rows: category } = await pool.query('select * from categorias where id = $1', [categoria_id]);
        if (!rowCount) {
            return res.status(404).json({ mensagem: 'A categoria selecionada não existe.' });
        };

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.stauts(401).json({ mensagem: 'Tipo inválido.' });
        }

        const query = 'insert into transacoes(descricao, valor, data, categoria_id, usuario_id, tipo)\
         values ($1, $2, $3, $4, $5, $6)\
         returning id, tipo, descricao, valor, data, usuario_id, categoria_id';

        const newTrasaction = await pool.query(query, [descricao, valor, data, categoria_id, id, tipo]);
        const formattedTransaction = { ...newTrasaction.rows[0], categoria_nome: category[0].descricao }

        return res.status(201).json(formattedTransaction);
    } catch (error) {
        return res.status(401).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' });
    }
};

const editTransaction = async (req, res) => {

};

const deleteTransaction = async (req, res) => {

};

module.exports = {
    signUp,
    signIn,
    showUser,
    updateUser,
    showCategories,
    showTransactions,
    showTransactionsById,
    addNewTransaction,
    editTransaction,
    deleteTransaction
}