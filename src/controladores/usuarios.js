const conexao = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome) {
        return res.status(404).json("O campo nome é obrigatório");
    }

    if (!email) {
        return res.status(404).json("O campo email é obrigatório");
    }

    if (!senha) {
        return res.status(404).json("O campo senha é obrigatório");
    }

    if (!nome_loja) {
        return res.status(404).json("O campo nome_loja é obrigatório");
    }

    try {

        const buscarUsuario = await conexao.knex('usuarios').where('email', email).first();
        console.log(buscarUsuario);

        if (buscarUsuario !== undefined) {
            return res.status(400).json("O email já existe");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await conexao.knex('usuarios').insert({ nome, email, senha: senhaCriptografada, nome_loja })

        if (!novoUsuario) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        return res.status(200).json("O usuario foi cadastrado com sucesso!");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const atualizarPerfil = async (req, res) => {
    const { nome, email, nome_loja } = req.body;
    let { senha } = req.body
    const { id } = req.usuario;

    if (!nome && !email && !senha && !nome_loja) {
        return res.status(404).json('É obrigatório informar ao menos um campo para atualização');
    }

    try {

        if (email) {
            if (email !== req.usuario.email) {
                const buscarEmail = await conexao.knex('usuarios').where({ email }).first('email');

                if (buscarEmail === email) {
                    return res.status(400).json("O email já existe");
                }
            }

        }

        if (senha) {
            const senhaCriptografada = await bcrypt.hash(senha, 10);
            senha = senhaCriptografada;
        }

        const atualizarUsuario = await conexao.knex('usuarios').update({ nome, email, senha, nome_loja }).where({ id }).returning('*');

        if (!atualizarUsuario) {
            return res.status(400).json("O usuario não foi atualizado");
        }

        return res.status(200).json('Usuario foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}



module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}