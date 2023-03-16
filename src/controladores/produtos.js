const conexao = require('../conexao');

const listarProdutos = async (req, res) => {
    const { id } = req.usuario;
    const { categoria } = req.query;

    try {
        const buscarProdutos = await conexao.knex('produtos').where({ usuario_id: id }).returning('*');
        console.log(buscarProdutos);

        if (categoria) {

            const filtroProdutoCategoria = buscarProdutos.filter(filtro => filtro.categoria == categoria);

            if (!filtroProdutoCategoria) {
                return res.status(400).json('Categoria não encontrada.')
            }

            return res.status(200).json(filtroProdutoCategoria);

        } else {
            return res.status(200).json(buscarProdutos);
        }
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {

        const buscarProdutos = await conexao.knex('produtos').where({ usuario_id: usuario.id }).returning('*');

        const filtroProdutoId = buscarProdutos.find(filtro => filtro.id == id);

        if (!filtroProdutoId) {
            return res.status(404).json('Produto não encontrado');
        } else {

            return res.status(200).json(filtroProdutoId);
        }
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    }

    if (!estoque) {
        return res.status(404).json('O campo estoque é obrigatório');
    }

    if (!preco) {
        return res.status(404).json('O campo preco é obrigatório');
    }

    if (!descricao) {
        return res.status(404).json('O campo descricao é obrigatório');
    }

    try {

        const novoProduto = await conexao.knex('produtos')
            .insert({ usuario_id: usuario.id, nome, estoque, preco, categoria, descricao, imagem })
            .returning('*');

        if (!novoProduto) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(200).json('O produto foi cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }

    try {

        const buscarProdutos = await conexao.knex('produtos').where({ usuario_id: usuario.id, id }).returning('*');

        if (!buscarProdutos) {
            return res.status(404).json('Produto não encontrado');
        }

        const atualizarProduto = await conexao.knex('produtos').update({ nome, estoque, preco, categoria, descricao, imagem }).where({ id });
        if (!atualizarProduto) {
            return res.status(400).json("O produto não foi atualizado");
        }

        return res.status(200).json('produto foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {

        const buscarProduto = await conexao.knex('produtos').where({ usuario_id: usuario.id, id });

        if (!buscarProduto) {
            return res.status(404).json('Produto não encontrado');
        }

        const deleteProduto = await conexao.knex('produtos').where({ id }).delete();
        if (!deleteProduto) {
            return res.status(400).json("O produto não foi excluido");
        }

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}