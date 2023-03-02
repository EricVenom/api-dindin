const running = (req, res) => {
    return res.json({ mensagem: "Rodando" });
}

module.exports = { running }