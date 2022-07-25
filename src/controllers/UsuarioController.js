import { Usuario } from '../models/Usuario.js';
import { Endereco } from '../models/Endereco.js';

const usuarioModel = new Usuario;
const enderecoModel = new Endereco;

class UsuarioController {
    async renderCadastro(req, res) {
        res.render('usuarios/cadastro.ejs', {
            acao: 'I',
            usuario: null,
            qtdSolicitacoesCpf: 0,
            qtdSolicitacoesNome: 0,
            qtdSolicitacoesLogin: 0
        });
    }

    async renderLista(req, res) {
        const usuarios = await usuarioModel.getUsuarios();

        res.render('usuarios/lista.ejs', { usuarios: usuarios });
    }

    async renderListaSolicitacoes(req, res) {
        const { tipoSolicitacao } = req.params;
        let tipoEscolhido;

        if(tipoSolicitacao === 'cpf') {
            tipoEscolhido = 'CPF';
        }else if(tipoSolicitacao === 'nome') {
            tipoEscolhido = 'Nome';
        }else if(tipoSolicitacao === 'login') {
            tipoEscolhido = 'Login';
        }else {
            return false;
        }

        const solicitacoes = await usuarioModel.getSolicitacoesUsuarios(tipoSolicitacao);

        let dia;
        let mes;
        let ano;

        solicitacoes.forEach(solicitacao => {
            dia = solicitacao.data_solicitacao.getDate() <= 9 ?  `0${solicitacao.data_solicitacao.getDate()}` : solicitacao.data_solicitacao.getDate();
            mes = solicitacao.data_solicitacao.getMonth() <= 8 ?  `0${solicitacao.data_solicitacao.getMonth() + 1}` : solicitacao.data_solicitacao.getMonth();
            ano = solicitacao.data_solicitacao.getFullYear();
            solicitacao.data_solicitacao = `${dia}/${mes}/${ano}`;

            if(solicitacao.data_aprovacao) {
                dia = solicitacao.data_aprovacao.getDate() <= 9 ?  `0${solicitacao.data_aprovacao.getDate()}` : solicitacao.data_aprovacao.getDate();
                mes = solicitacao.data_aprovacao.getMonth() <= 8 ?  `0${solicitacao.data_aprovacao.getMonth() + 1}` : solicitacao.data_aprovacao.getMonth();
                ano = solicitacao.data_aprovacao.getFullYear();
                solicitacao.data_aprovacao = `${dia}/${mes}/${ano}`;
            }
        });

        return res.render('usuarios/solicitacoes.ejs', {
            tipoEscolhido,
            solicitacoes
        });
    }

    async getUsuarioById(req, res) {
        const { id } = req.params;

        let usuario = await usuarioModel.getUsuario('id', id);

        let dataCadastro = usuario[0].data_cadastro;
        const diaCadastro = dataCadastro.getDate() <= 9 ?  `0${dataCadastro.getDate()}` : dataCadastro.getDate();
        const mesCadastro = dataCadastro.getMonth() <= 8 ?  `0${dataCadastro.getMonth() + 1}` : dataCadastro.getMonth() + 1;
        const anoCadastro = dataCadastro.getFullYear();
        dataCadastro = `${diaCadastro}/${mesCadastro}/${anoCadastro}`;

        let dataRg = usuario[0].data_rg;
        const diaRg = dataRg.getDate() <= 9 ?  `0${dataRg.getDate()}` : dataRg.getDate();
        const mesRg = dataRg.getMonth() <= 8 ?  `0${dataRg.getMonth() + 1}` : dataRg.getMonth() + 1;
        const anoRg = dataRg.getFullYear();
        dataRg = `${diaRg}/${mesRg}/${anoRg}`;

        usuario[0].data_cadastro = dataCadastro;
        usuario[0].data_rg = dataRg;

        const solicitacoes = await usuarioModel.getSolicitacoesPendentesUsuario(id);

        return res.render('usuarios/cadastro.ejs', {
            acao: 'U', 
            usuario: usuario[0],
            qtdSolicitacoesCpf: solicitacoes[0][0].qtd_solicitacoes_cpf,
            qtdSolicitacoesNome: solicitacoes[1][0].qtd_solicitacoes_nome,
            qtdSolicitacoesLogin: solicitacoes[2][0].qtd_solicitacoes_login
        });
    }

    async getUsuarioByCpf(req, res) {
        const { cpf } = req.body;

        const usuario = await usuarioModel.getUsuario('cpf', cpf.replace(/[^\d]/g, ""));

        return res.json(usuario[0]);
    }

    async getUsuarioByLogin(req, res) {
        const { login } = req.body;

        const usuario = await usuarioModel.getUsuario('login', login);

        return res.json(usuario[0]);
    }

    async getUsuarioByEmail(req, res) {
        const { email } = req.body;

        const usuario = await usuarioModel.getUsuario('email', email);

        return res.json(usuario[0]);
    }

    async store(req, res) {
        const { 
            cpfCnpj,
            nome,
            login,
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
            return res.json({ message: 'O nome do usuário é de preenchimento obrigatório!' });
        }
    
        if(!login) {
            return res.json({ message: 'O login do usuário é de preenchimento obrigatório!' });
        }
    
        if(!email) {
            return res.json({ message: 'O e-mail do usuário é de preenchimento obrigatório!' });
        }
    
        if(!celular) {
            return res.json({ message: 'O número do celular do usuário é de preenchi,ento obrigatório!' });
        }

        let dataRgFormatada = null;

        if(dataRg !== undefined){
            dataRgFormatada = dataRg.split('/');
            dataRgFormatada = `${dataRgFormatada[2]}-${dataRgFormatada[1]}-${dataRgFormatada[0]}`;
        }

        let usuario = await usuarioModel.getUsuario('cpf', cpfCnpj.replace(/[^\d]/g, ""));

        if(usuario[0]) {
            return res.json(usuario[0]);
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

        usuario = await usuarioModel.storeUsuario({
            cpfCnpj: cpfCnpj.replace(/[^\d]/g, ""),
            nome: nome,
            login: login,
            email: email,
            celular: celular.replace(/[^\d]/g, ""),
            telefone: telefone.replace(/[^\d]/g, ""),
            rg: rg.replace(/[^\d]/g, ""),
            dataRg: dataRgFormatada,
            idEndereco: endereco[0].id_endereco
        });

        return res.json(usuario[0]);
    }

    async update(req, res) {
        const { 
            idUsuario,
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
            return res.json({ message: 'O e-mail do usuário é de preenchimento obrigatório!' });
        }
    
        if(!celular) {
            return res.json({ message: 'O número do celular do usuário é de preenchi,ento obrigatório!' });
        }

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

        const usuario = await usuarioModel.updateUsuario({
            idUsuario: idUsuario,
            email: email,
            celular: celular.replace(/[^\d]/g, ""),
            telefone: telefone.replace(/[^\d]/g, ""),
            rg: rg.replace(/[^\d]/g, ""),
            dataRg: dataRgFormatada,
            idEndereco: endereco[0].id_endereco
        });

        return res.json(usuario[0]);
    }

    async updateStatusUsuario(req, res) {
        const { idUsuario } = req.body;

        const usuario = await usuarioModel.getUsuario('id', idUsuario);

        if(!usuario[0]){
            return res.json({ message: 'Usuário não existe!', erro: true });
        }

        const novoStatus = usuario[0].status_usuario == 0 ? 1 : 0;

        const response = await usuarioModel.updateStatusUsuario(idUsuario, novoStatus);

        if(response.affectedRows > 0 && novoStatus == 1){
            return res.json({ message: 'Usuário desbloqueado com sucesso!', erro: false });
        }else if(response.affectedRows > 0 && novoStatus == 0) {
            return res.json({ message: 'Usuário bloqueado com sucesso!', erro: false });
        }
    }

    async solicitaAlteracao(req, res) {
        const { campo, valorAnterior, novoValor, idUsuario, motivo } = req.body;

        if(campo == 'cpf' && (novoValor.length < 14 || novoValor.length > 14)) {
            return res.json({ message: 'Preencha corretamente o CPF do usuário!', erro: true });
        } else if(campo !== 'cpf' && !novoValor){
            return res.json({ message: `Preencha corretamente o ${campo} do usuário!`, erro: true });
        }

        if(campo !== 'nome') {
            let usuario = await usuarioModel.getUsuario(campo, campo == 'cpf' ? novoValor.replace(/[^\d]/g, "") : novoValor);

            if(usuario[0]){
                return res.json({ message: `Já existe um usuário com o ${campo} informado!`, erro: true });
            }
        }

        const response = await usuarioModel.solicitaAlteracaoUsuario({
            campo, 
            valorAnterior: campo == 'cpf' ? valorAnterior.replace(/[^\d]/g, "") : valorAnterior, 
            novoValor: campo == 'cpf' ? novoValor.replace(/[^\d]/g, "") : novoValor, 
            idUsuario, 
            //idSolicitante: req.idUsuario, 
            idSolicitante: 1,
            motivo
        });

        if(response.affectedRows == 1) {
            return res.json({ message: `Solicitação realizada com sucesso!`, erro: false });
        }else{
            return res.json({ message: `Houve um erro ao solicitar a alteração do ${campo} do usuário!`, erro: true});
        }
    }

    async updateSolicitacao(req, res) {
        const { idSolicitacao, novoStatus, observacao, tipoSolicitacao } = req.body;

        if(!idSolicitacao){
            return res.json({ message: 'Erro ao aprovar/reprovar solicitação!' })
        }

        const response = await usuarioModel.updateSolicitacaoUsuario({
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

export { UsuarioController };