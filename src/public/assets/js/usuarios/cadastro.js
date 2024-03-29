window.onload = () => {
    const acao = document.querySelector('#acao');

    // Ação Insert
    if(acao.value === 'I') {
        // Atualiza o campo "data de cadastro" para a data de hoje
        const data = new Date();
        const dia = data.getDate() <= 9 ?  `0${data.getDate()}` : data.getDate();
        const mes = data.getMonth() <= 9 ?  `0${data.getMonth() + 1}` : data.getMonth();
        document.querySelector('#dataCadastro').value = `${dia}/${mes}/${data.getFullYear()}`;

        // Adiciona as funções de validação aos campos "cep", "cpf", "login" e "e-mail"
        let cep = document.querySelector('#cep');
        cep.addEventListener('blur', () => pesquisaCep(cep.value));
    
        let cpf = document.querySelector('#cpfCnpj');
        cpf.addEventListener('blur', () => validaCpf(cpf.value));
    
        let login = document.querySelector('#login');
        login.addEventListener('blur', () => validaLogin(login.value));
    
        let email = document.querySelector('#email');
        email.addEventListener('blur', () => validaEmail(email.value));

        // Desabilita o botão de solicitar alterações
        const btnOpcoes = document.querySelector('#btnOpcoes');
        btnOpcoes.style.display = 'none';

    }else{ // Ação Update
        // Adiciona a função de exibir o formulário de solicitação de alteração aos botões de solicitações
        const btnOpcoes = document.querySelector('#btnOpcoes');
        btnOpcoes.addEventListener('click', exibeOpcoes);

        const btnAlteraCpf = document.querySelector('#btnAlteraCpf');
        btnAlteraCpf.addEventListener('click', () => exibeFormOpcoes('cpf'));

        const btnAlteraNome = document.querySelector('#btnAlteraNome');
        btnAlteraNome.addEventListener('click', () => exibeFormOpcoes('nome'));

        const btnAlteraLogin = document.querySelector('#btnAlteraLogin');
        btnAlteraLogin.addEventListener('click', () => exibeFormOpcoes('login'));
    }
    
    // Aplica as máscaras aos campos
    maskCep('cep');
    maskCpf('cpfCnpj');
    maskData('dataRg');
    maskCel('celular');
    maskTel('telefone');
}

const btnSalvar = document.querySelector('#btnSalvar');
btnSalvar.addEventListener('click', validaForm);

// Função que verifica o preenchimento dos campos e faz o post de acordo com a acao (insert ou update)
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
            
            // Redireciona para a página do usuário criado
            return setTimeout(() => {
                location.href = `/usuario/${usuario.data.id_usuario}`;
            }, 3000);
        }
    } catch (error) {
        enableButton('btnSalvar', 'Salvar');
        
        return warningAlert({ descricao: error });
    }
}

// Função que verifica se o cpf digitado já existe na base de dados
async function validaCpf(cpf) {
    if(cpf.length == 14) {
        const usuario = await axios.post('/usuario/cpf', { cpf: cpf });

        if(usuario.data) {
            document.querySelector('#cpfCnpj').value = '';
            return warningAlert({ descricao: 'Já existe um usuário com esse CPF cadastrado!' });
        }
    }
}

// Função que verifica se o login digitado já existe na base de dados
async function validaLogin(login) {
    if(login) {
        const usuario = await axios.post('/usuario/login', { login: login });

        if(usuario.data) {
            document.querySelector('#login').value = '';
            return warningAlert({ descricao: 'Já existe um usuário com esse login cadastrado!' });
        }
    }
}

// Função que veriica se o email digitado já existe na base de dados
async function validaEmail(email) {
    if(email) {
        const usuario = await axios.post('/usuario/email', { email: email });

        if(usuario.data) {
            document.querySelector('#email').value = '';
            return warningAlert({ descricao: 'Já existe um usuário com esse e-mail cadastrado!' });
        }
    }
}

// Função que exibe os botões de solicitação de alteração dos dados sensíveis
function exibeOpcoes() {
    const divOpcoes = document.querySelector('.dropdown');
    if(divOpcoes.style.display == 'flex') {
        divOpcoes.style.display = 'none';
    }else{
        divOpcoes.style.display = 'flex';
        divOpcoes.style.flexDirection = 'column';
    }
}

// Função que exibe o formulário de preenchimentos dos novos dados para solicitação
async function exibeFormOpcoes(opcao) {
    // Chama a função que verifica se já existe alguma solicitação pendente de aprovação
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

    // Callback que retornará os dados preenchidos no formulário
    const callback = () => {
        return [
            document.querySelector('#swal-input').value,
            document.querySelector('#swal-input2').value
        ]
    }

    // Verifica qual dado será feita a solicitação de alteração
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

    // Campos que serão enviados ao formulário para preenchimento
    const campos = `
        <input type="text" id="swal-input" class="swal2-input" ${mask} placeholder="Novo ${label}" value="${valor}">
        <textarea id="swal-input2" class="swal2-textarea" cols="24" rows="10" placeholder="Motivo da solicitação"></textarea>`;

    const valores = await formAlert({
        titulo: `Solicitar Alteração de ${label}`,
        campos: campos
        },
        callback
    );

    // Verifica se os campos foram preenchidos
    if(opcao == 'cpf' && valores[0].length < 14) {
        return warningAlert({descricao: 'Preencha corretamente o CPF!'});
    }else if(opcao !== 'cpf' && !valores[0]){
        return warningAlert({descricao: `Preencha corretamente o ${opcao}!`});
    }

    if(!valores[1]) {
        return warningAlert({descricao: 'Preencha o motivo da solicitação!'});
    }

    // Dados que serão enviados para solicitação
    const dados = {
        campo: opcao,
        valorAnterior: valor,
        novoValor: valores[0],
        idUsuario: idUsuario,
        motivo: valores[1]
    }

    // Post da solicitação
    const response = await axios.post('/usuario/solicitacao', dados);

    if(!response.data.erro) {
        successAlert({ titulo: response.data.message });

        // Recarrega a página
        return setTimeout(() => {
            location.reload();
        }, 2500);
    }else{
        return warningAlert({ descricao: response.data.message });
    }
}

// Função que verifica se existe alguma solicitação pendente de aprovação
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