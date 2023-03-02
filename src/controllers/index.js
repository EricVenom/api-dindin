const signUp = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        if (!nome || !email || !senha) {
            return res.json({ mensagem: "Todos os campos são obrigatórios." })
        }

        return res.json({ nome, email, senha });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}

module.exports = { signUp }