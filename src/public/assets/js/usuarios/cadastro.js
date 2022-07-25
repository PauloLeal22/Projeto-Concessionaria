window.onload = () => {
    const acao = document.querySelector('#acao');
    if(acao.value === 'I') {
        const data = new Date();
        const dia = data.getDate() <= 9 ?  `0${data.getDate()}` : data.getDate();
        const mes = data.getMonth() <= 9 ?  `0${data.getMonth() + 1}` : data.getMonth();
        document.querySelector('#dataCadastro').value = `${dia}/${mes}/${data.getFullYear()}`;

        let cep = document.querySelector('#cep');
        cep.addEventListener('blur', () => pesquisaCep(cep.value));
    
        let cpf = document.querySelector('#cpfCnpj');
        cpf.addEventListener('blur', () => validaCpf(cpf.value));
    
        let login = document.querySelector('#login');
        login.addEventListener('blur', () => validaLogin(login.value));
    
        let email = document.querySelector('#email');
        email.addEventListener('blur', () => validaEmail(email.value));

        const btnOpcoes = document.querySelector('#btnOpcoes');
        btnOpcoes.style.display = 'none';
    }else{
        const btnOpcoes = document.querySelector('#btnOpcoes');
        btnOpcoes.addEventListener('click', exibeOpcoes);

        const btnAlteraCpf = document.querySelector('#btnAlteraCpf');
        btnAlteraCpf.addEventListener('click', () => exibeFormOpcoes('cpf'));

        const btnAlteraNome = document.querySelector('#btnAlteraNome');
        btnAlteraNome.addEventListener('click', () => exibeFormOpcoes('nome'));

        const btnAlteraLogin = document.querySelector('#btnAlteraLogin');
        btnAlteraLogin.addEventListener('click', () => exibeFormOpcoes('login'));
    }
    
    maskCep('cep');
    maskCpf('cpfCnpj');
    maskData('dataRg');
    maskCel('celular');
    maskTel('telefone');
}

const btnSalvar = document.querySelector('#btnSalvar');
btnSalvar.addEventListener('click', validaForm);

async function validaForm() {
    event.preventDefault();

    const idUsuario = document.querySelector('#idUsuario');
    const cpfCnpj = document.querySelector('#cpfCnpj');
    const nome = document.querySelector('#nome');
    const login = document.querySelector('#login');
    const email = document.querySelector('#email');
    const celular = document.querySelector('#celular');
    const telefone = document.querySelector('#telefone');
    const rg = document.querySelector('#rg');
    const dataRg = document.querySelector('#dataRg');
    const cep = document.querySelector('#cep');
    const logradouro = document.querySelector('#logradouro');
    const numero = document.querySelector('#numero');
    const complemento = document.querySelector('#complemento');
    const bairro = document.querySelector('#bairro');
    const estado = document.querySelector('#estado');
    const cidade = document.querySelector('#cidade');
    const acao = document.querySelector('#acao');

    if(cpfCnpj.value.length < 14) {
        return warningAlert({ descricao: 'Preencha o CPF corretamente!' });
    }

    if(!nome.value) {
        return warningAlert({ descricao: 'O nome do usuário é de preenchimento obrigatório!' });
    }

    if(!login.value) {
        return warningAlert({ descricao: 'O login do usuário é de preenchimento obrigatório!' });
    }

    if(!email.value) {
        return warningAlert({ descricao: 'O e-mail do usuário é de preenchimento obrigatório!' });
    }

    if(!celular.value) {
        return warningAlert({ descricao: 'O número do celular do usuário é de preenchi,ento obrigatório!' });
    }

    if(!cep.value) {
        return warningAlert({ descricao: 'O CEP do usuário é de preenchimento obrigatório!' });
    }

    if(!logradouro.value) {
        return warningAlert({ descricao: 'O logradouro da residência do usuário é de preenchimento obrigatório!' });
    }

    if(!numero.value) {
        return warningAlert({ descricao: 'O número da residência do usuário é de preenchimento obrigatório!' });
    }

    if(!bairro.value) {
        return warningAlert({ descricao: 'O bairro da residência do usuário é de preenchimento obrigatório!' });
    }

    if(!cidade.value) {
        return warningAlert({ descricao: 'A cidade da residência do usuário é de preenchimento obrigatório!' });
    }

    const dados = {
        idUsuario: idUsuario.value,
        cpfCnpj: cpfCnpj.value,
        nome: nome.value,
        login: login.value,
        email: email.value,
        celular: celular.value,
        telefone: telefone.value,
        rg: rg.value,
        dataRg: dataRg.value,
        cep: cep.value,
        logradouro: logradouro.value,
        numero: numero.value,
        complemento: complemento.value,
        bairro: bairro.value,
        estado: estado.value,
        cidade: cidade.value,
        acao: acao.value
    }

    try {
        disableButton('btnSalvar');

        let usuario;
        const acao = document.querySelector('#acao');

        if(acao.value === 'I') {
            usuario = await axios.post('/usuario', dados);
        }else if(acao.value === 'U'){
            usuario = await axios.patch('/usuario', dados);
        }
        

        if(usuario.data) {
            enableButton('btnSalvar', 'Salvar');

            if(acao.value === 'I') {
                successAlert({ titulo: 'Usuário cadastrado com sucesso!' });
            }else {
                successAlert({ titulo: 'Dados atualizados com sucesso!' });
            }
            
            return setTimeout(() => {
                location.href = `/usuario/${usuario.data.id_usuario}`;
            }, 3000);
        }
    } catch (error) {
        enableButton('btnSalvar', 'Salvar');
        
        return warningAlert({ descricao: error });
    }
}

async function validaCpf(cpf) {
    if(cpf.length == 14) {
        const usuario = await axios.post('/usuario/cpf', { cpf: cpf });

        if(usuario.data) {
            document.querySelector('#cpfCnpj').value = '';
            return warningAlert({ descricao: 'Já existe um usuário com esse CPF cadastrado!' });
        }
    }
}

async function validaLogin(login) {
    if(login) {
        const usuario = await axios.post('/usuario/login', { login: login });

        if(usuario.data) {
            document.querySelector('#login').value = '';
            return warningAlert({ descricao: 'Já existe um usuário com esse login cadastrado!' });
        }
    }
}

async function validaEmail(email) {
    if(email) {
        const usuario = await axios.post('/usuario/email', { email: email });

        if(usuario.data) {
            document.querySelector('#email').value = '';
            return warningAlert({ descricao: 'Já existe um usuário com esse e-mail cadastrado!' });
        }
    }
}

function exibeOpcoes() {
    const divOpcoes = document.querySelector('.dropdown');
    if(divOpcoes.style.display == 'flex') {
        divOpcoes.style.display = 'none';
    }else{
        divOpcoes.style.display = 'flex';
        divOpcoes.style.flexDirection = 'column';
    }
}

async function exibeFormOpcoes(opcao) {
    const { aviso } = verificaSolicitacoesPendentes(opcao);

    if(aviso !== '') {
        return warningAlert({ descricao: aviso });
    }

    const cpf = document.querySelector('#cpfCnpj').value;
    const nome = document.querySelector('#nome').value;
    const login = document.querySelector('#login').value;
    const idUsuario = document.querySelector('#idUsuario').value;

    let valor;
    let label;
    let mask = '';

    const callback = () => {
        return [
            document.querySelector('#swal-input').value,
            document.querySelector('#swal-input2').value
        ]
    }

    if(opcao === 'cpf') {
        label = 'CPF'
        valor = cpf;
        mask = 'onfocus="maskCpf(`swal-input`);"';
    }else if(opcao === 'nome') {
        label = 'Nome'
        valor = nome;
    }else if(opcao === 'login') {
        label = 'Login'
        valor = login;
    }

    const campos = `
        <input type="text" id="swal-input" class="swal2-input" ${mask} placeholder="Novo ${label}" value="${valor}">
        <textarea id="swal-input2" class="swal2-textarea" cols="24" rows="10" placeholder="Motivo da solicitação"></textarea>`;

    const valores = await formAlert({
        titulo: `Solicitar Alteração de ${label}`,
        campos: campos
        },
        callback
    );

    if(opcao == 'cpf' && valores[0].length < 14) {
        return warningAlert({descricao: 'Preencha corretamente o CPF!'});
    }else if(opcao !== 'cpf' && !valores[0]){
        return warningAlert({descricao: `Preencha corretamente o ${opcao}!`});
    }

    if(!valores[1]) {
        return warningAlert({descricao: 'Preencha o motivo da solicitação!'});
    }

    const dados = {
        campo: opcao,
        valorAnterior: valor,
        novoValor: valores[0],
        idUsuario: idUsuario,
        motivo: valores[1]
    }

    const response = await axios.post('/usuario/solicitacao', dados);

    if(!response.data.erro) {
        successAlert({ titulo: response.data.message });

        return setTimeout(() => {
            location.reload();
        }, 2500);
    }else{
        return warningAlert({ descricao: response.data.message });
    }
}

function verificaSolicitacoesPendentes(opcao) {
    const qtdSolicitacoesCpf = document.querySelector('#qtdSolicitacoesCpf').value;
    const qtdSolicitacoesNome = document.querySelector('#qtdSolicitacoesNome').value;
    const qtdSolicitacoesLogin = document.querySelector('#qtdSolicitacoesLogin').value;
    let aviso = '';

    if(opcao == 'cpf') {
        if(qtdSolicitacoesCpf > 0) {
            aviso = 'Já existe uma solicitação de alteração do CPF pendente para esse usuário!';
        }
    }

    if(opcao == 'nome') {
        if(qtdSolicitacoesNome > 0) {
            aviso = 'Já existe uma solicitação de alteração do nome pendente para esse usuário!';
        }
    }
    
    if(opcao == 'login') {
        if(qtdSolicitacoesLogin > 0) {
            aviso = 'Já existe uma solicitação de alteração do login pendente para esse usuário!';
        }
    }

    return { aviso };
}