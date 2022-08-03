import { Cliente } from '../models/Cliente.js';
import { Endereco } from '../models/Endereco.js';

const clienteModel = new Cliente;
const enderecoModel = new Endereco;

import { formatDate } from '../public/assets/utils/formatDate.js';

class ClienteController {
    renderCadastro(req, res) {
        return res.render('clientes/cadastro.ejs', {
            acao: 'I',
            cliente: null,
            qtdSolicitacoesCpfCnpj: 0,
            qtdSolicitacoesNome: 0
        });
    }

    async renderLista(req, res) {
        const clientes = await clienteModel.getClientes();

        clientes.forEach(cliente => {
            cliente.data_cadastro = formatDate(cliente.data_cadastro);
        });

        res.render('clientes/lista.ejs', { clientes: clientes });
    }

    async renderListaSolicitacoes(req, res) {
        const { tipoSolicitacao } = req.params;
        let tipoEscolhido;

        if(tipoSolicitacao === 'cpf') {
            tipoEscolhido = 'CPF/CNPJ';
        }else if(tipoSolicitacao === 'nome') {
            tipoEscolhido = 'Nome';
        }else {
            return false;
        }

        const solicitacoes = await clienteModel.getSolicitacoesClientes(tipoSolicitacao);

        solicitacoes.forEach(solicitacao => {
            solicitacao.data_solicitacao = formatDate(solicitacao.data_solicitacao);

            if(solicitacao.data_aprovacao) {
                solicitacao.data_aprovacao = formatDate(solicitacao.data_aprovacao);
            }
        });

        return res.render('clientes/solicitacoes.ejs', {
            tipoEscolhido,
            solicitacoes
        });
    }


    async getClienteById(req, res) {
        const { id } = req.params;

        let cliente = await clienteModel.getCliente('id', id);

        cliente[0].data_cadastro = formatDate(cliente[0].data_cadastro);
        cliente[0].data_nasc = formatDate(cliente[0].data_nasc);
        cliente[0].data_rg = formatDate(cliente[0].data_rg);

        const solicitacoes = await clienteModel.getSolicitacoesPendentesCliente(id);

        return res.render('clientes/cadastro.ejs', {
            acao: 'U', 
            cliente: cliente[0],
            qtdSolicitacoesCpfCnpj: solicitacoes[0][0].qtd_solicitacoes_cpf,
            qtdSolicitacoesNome: solicitacoes[1][0].qtd_solicitacoes_nome,
        });
    }

    async getClienteByCpf(req, res) {
        const { cpf } = req.body;

        const cliente = await clienteModel.getCliente('cpf', cpf.replace(/[^\d]/g, ""));

        return res.json(cliente[0]);
    }

    async getClienteByEmail(req, res) {
        const { email } = req.body;

        const cliente = await clienteModel.getCliente('email', email);

        return res.json(cliente[0]);
    }

    async store(req, res) {
        const { 
            cpfCnpj,
            nome,
            sexo,
            dataNasc,
            email,
            celular,
            telefone,
            rg,
            dataRg,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado
        } = req.body;

        if(cpfCnpj.length < 14) {
            return res.json({ message: 'Preencha o CPF corretamente!' });
        }
    
        if(!nome) {
            return res.json({ message: 'O nome do cliente é de preenchimento obrigatório!' });
        }

        if(!dataNasc) {
            return res.json({ message: 'A data de nascimento do cliente é de preenchimento obrigatório!' });
        }
    
        if(!email) {
            return res.json({ message: 'O e-mail do cliente é de preenchimento obrigatório!' });
        }
    
        if(!celular) {
            return res.json({ message: 'O número do celular do cliente é de preenchimento obrigatório!' });
        }

        let dataRgFormatada = null;

        if(dataRg !== undefined){
            dataRgFormatada = dataRg.split('/');
            dataRgFormatada = `${dataRgFormatada[2]}-${dataRgFormatada[1]}-${dataRgFormatada[0]}`;
        }

        let dataNascFormatada = null;
        dataNascFormatada = dataNasc.split('/');
        dataNascFormatada = `${dataNascFormatada[2]}-${dataNascFormatada[1]}-${dataNascFormatada[0]}`;

        let cliente = await clienteModel.getCliente('cpf', cpfCnpj.replace(/[^\d]/g, ""));

        if(cliente[0]) {
            return res.json(cliente[0]);
        }

        let endereco = await enderecoModel.getEndereco(cep.replace('-', ''), logradouro, numero);

        if(endereco[0] == undefined || endereco[0] == null) {
            endereco = await enderecoModel.storeEndereco({
                cep: cep.replace('-', ''),
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                estado
            });
        }

        cliente = await clienteModel.storeCliente({
            cpfCnpj: cpfCnpj.replace(/[^\d]/g, ""),
            nome: nome,
            sexo: sexo,
            dataNasc: dataNascFormatada,
            email: email,
            celular: celular.replace(/[^\d]/g, ""),
            telefone: telefone.replace(/[^\d]/g, ""),
            rg: rg.replace(/[^\d]/g, ""),
            dataRg: dataRgFormatada,
            idUsuario: 1,
            idEndereco: endereco[0].id_endereco
        });

        return res.json(cliente[0]);
    }

    async update(req, res) {
        const { 
            idCliente,
            sexo,
            dataNasc,
            email,
            celular,
            telefone,
            rg,
            dataRg,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado
        } = req.body;
    
        if(!email) {
            return res.json({ message: 'O e-mail do cliente é de preenchimento obrigatório!' });
        }

        if(!dataNasc) {
            return res.json({ message: 'A data de nascimento do cliente é de preenchimento obrigatório!' });
        }
    
        if(!celular) {
            return res.json({ message: 'O número do celular do cliente é de preenchimento obrigatório!' });
        }

        let dataNascFormatada = null;
        dataNascFormatada = dataNasc.split('/');
        dataNascFormatada = `${dataNascFormatada[2]}-${dataNascFormatada[1]}-${dataNascFormatada[0]}`;

        let dataRgFormatada = null;
        if(dataRg !== undefined){
            dataRgFormatada = dataRg.split('/');
            dataRgFormatada = `${dataRgFormatada[2]}-${dataRgFormatada[1]}-${dataRgFormatada[0]}`;
        }

        let endereco = await enderecoModel.getEndereco(cep.replace('-', ''), logradouro, numero);

        if(endereco[0] == undefined || endereco[0] == null) {
            endereco = await enderecoModel.storeEndereco({
                cep: cep.replace('-', ''),
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                estado
            });
        }

        const cliente = await clienteModel.updateCliente({
            idCliente,
            sexo,
            dataNasc: dataNascFormatada,
            email,
            celular: celular.replace(/[^\d]/g, ""),
            telefone: telefone.replace(/[^\d]/g, ""),
            rg: rg.replace(/[^\d]/g, ""),
            dataRg: dataRgFormatada,
            idEndereco: endereco[0].id_endereco
        });

        return res.json(cliente[0]);
    }

    async solicitaAlteracao(req, res) {
        const { campo, valorAnterior, novoValor, idCliente, motivo } = req.body;

        if(campo == 'cpf' && (novoValor.length < 14)) {
            return res.json({ message: 'Preencha corretamente o CPF/CNPJ do usuário!', erro: true });
        } else if(campo !== 'cpf' && !novoValor){
            return res.json({ message: `Preencha corretamente o ${campo} do usuário!`, erro: true });
        }

        if(campo !== 'nome') {
            let cliente = await clienteModel.getCliente(campo, campo == 'cpf' ? novoValor.replace(/[^\d]/g, "") : novoValor);

            if(cliente[0]){
                return res.json({ message: `Já existe um cliente com o ${campo} informado!`, erro: true });
            }
        }

        const response = await clienteModel.solicitaAlteracaoCliente({
            campo, 
            valorAnterior: campo == 'cpf' ? valorAnterior.replace(/[^\d]/g, "") : valorAnterior, 
            novoValor: campo == 'cpf' ? novoValor.replace(/[^\d]/g, "") : novoValor, 
            idCliente, 
            //idSolicitante: req.idUsuario, 
            idSolicitante: 1,
            motivo
        });

        if(response.affectedRows == 1) {
            return res.json({ message: `Solicitação realizada com sucesso!`, erro: false });
        }else{
            return res.json({ message: `Houve um erro ao solicitar a alteração do ${campo} do cliente!`, erro: true});
        }
    }

    async updateSolicitacao(req, res) {
        const { idSolicitacao, novoStatus, observacao, tipoSolicitacao } = req.body;

        if(!idSolicitacao){
            return res.json({ message: 'Erro ao aprovar/reprovar solicitação!' })
        }

        const response = await clienteModel.updateSolicitacaoCliente({
            idSolicitacao, 
            novoStatus, 
            observacao, 
            idAprovador: 1, 
            tipoSolicitacao
        });

        if(response.affectedRows == 1) {
            if(novoStatus == 1) {
                return res.json({ message: 'Solicitação aprovada com sucesso!', erro: false });
            }else {
                return res.json({ message: 'Solicitação reprovada com sucesso!', erro: false });
            }
        }else {
            return res.json({ message: 'Houve um erro ao aprovar/reprovar a solicitação!', erro: true });
        }
    }
}

export { ClienteController };