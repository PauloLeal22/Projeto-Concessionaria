import { Endereco } from '../models/Endereco.js';

const enderecoModel = new Endereco;

class EnderecoController {
    async getEnderecoByCep(req, res) {
        const { cep, logradouro, numero } = req.query;

        const endereco = await enderecoModel.getEndereco(cep, logradouro, numero);

        return res.json(endereco[0]);
    }

    async store(req, res) {
        const { cep, logradouro, numero, complemento, bairro, cidade, estado } = req.body;

        const endereco = await enderecoModel.storeEndereco({
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado
        });

        return res.json(endereco[0]);
    }
}

export { EnderecoController };