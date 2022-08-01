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
    
        let email = document.querySelector('#email');
        email.addEventListener('blur', () => validaEmail(email.value));

        const btnOpcoes = document.querySelector('#btnOpcoes');
        btnOpcoes.style.display = 'none';

        const tipoPessoa = document.querySelector('#tipoPessoa');
        tipoPessoa.addEventListener('change', (event) => alteraCampoCpfCnpj(event.target.value));
    }else {
        const btnOpcoes = document.querySelector('#btnOpcoes');
        btnOpcoes.addEventListener('click', exibeOpcoes);

        const btnAlteraCpf = document.querySelector('#btnAlteraCpf');
        btnAlteraCpf.addEventListener('click', () => exibeFormOpcoes('cpf'));

        const btnAlteraNome = document.querySelector('#btnAlteraNome');
        btnAlteraNome.addEventListener('click', () => exibeFormOpcoes('nome'));

        const cpfCnpj = document.querySelector('#cpfCnpj');
        const tipoPessoa = document.querySelectorAll('#tipoPessoa option');
        if(cpfCnpj.value.length === 11) {
            maskCpf('cpfCnpj');
            tipoPessoa[0].setAttribute('selected', 'selected');
        }else if(cpfCnpj.value.length === 14) {
            maskCnpj('cpfCnpj');
            tipoPessoa[1].setAttribute('selected', 'selected');
        }
    }

    maskCep('cep');
    maskData('dataRg');
    maskCel('celular');
    maskTel('telefone');
}

function alteraCampoCpfCnpj(tipoPessoa) {
    document.querySelector('#cpfCnpj').value = '';

    if(tipoPessoa == 'pj') {
        document.querySelector('#labelCpfCnpj').innerHTML = 'CNPJ <span class="required">*</span>';
        maskCnpj('cpfCnpj');
    }else {
        document.querySelector('#labelCpfCnpj').innerHTML = 'CPF <span class="required">*</span>';
        maskCpf('cpfCnpj');
    }
}

const btnSalvar = document.querySelector('#btnSalvar');
btnSalvar.addEventListener('click', validaForm);

async function validaForm() {
    event.preventDefault();

    const idCliente = document.querySelector('#idCliente');
    const cpfCnpj = document.querySelector('#cpfCnpj');
    const nome = document.querySelector('#nome');
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
        return warningAlert({ descricao: 'O nome do cliente é de preenchimento obrigatório!' });
    }

    if(!email.value) {
        return warningAlert({ descricao: 'O e-mail do cliente é de preenchimento obrigatório!' });
    }

    if(!celular.value) {
        return warningAlert({ descricao: 'O número do celular do cliente é de preenchi,ento obrigatório!' });
    }

    if(!cep.value) {
        return warningAlert({ descricao: 'O CEP do cliente é de preenchimento obrigatório!' });
    }

    if(!logradouro.value) {
        return warningAlert({ descricao: 'O logradouro da residência do cliente é de preenchimento obrigatório!' });
    }

    if(!numero.value) {
        return warningAlert({ descricao: 'O número da residência do cliente é de preenchimento obrigatório!' });
    }

    if(!bairro.value) {
        return warningAlert({ descricao: 'O bairro da residência do cliente é de preenchimento obrigatório!' });
    }

    if(!cidade.value) {
        return warningAlert({ descricao: 'A cidade da residência do cliente é de preenchimento obrigatório!' });
    }

    const dados = {
        idCliente: idCliente.value,
        cpfCnpj: cpfCnpj.value,
        nome: nome.value,
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

        let cliente;
        const acao = document.querySelector('#acao');

        if(acao.value === 'I') {
            cliente = await axios.post('/cliente', dados);
        }else if(acao.value === 'U'){
            cliente = await axios.patch('/cliente', dados);
        }
        

        if(cliente.data) {
            enableButton('btnSalvar', 'Salvar');

            if(acao.value === 'I') {
                successAlert({ titulo: 'Cliente cadastrado com sucesso!' });
            }else {
                successAlert({ titulo: 'Dados atualizados com sucesso!' });
            }
            
            return setTimeout(() => {
                location.href = `/cliente/${cliente.data.id_cliente}`;
            }, 3000);
        }
    } catch (error) {
        enableButton('btnSalvar', 'Salvar');
        
        return warningAlert({ descricao: error });
    }
}

async function validaCpf(cpf) {
    if(cpf.length == 14) {
        const cliente = await axios.post('/cliente/cpf', { cpf: cpf });

        if(cliente.data) {
            document.querySelector('#cpfCnpj').value = '';
            return warningAlert({ descricao: 'Já existe um cliente com esse CPF cadastrado!' });
        }
    }
}

async function validaEmail(email) {
    if(email) {
        const cliente = await axios.post('/cliente/email', { email: email });

        if(cliente.data) {
            document.querySelector('#email').value = '';
            return warningAlert({ descricao: 'Já existe um cliente com esse e-mail cadastrado!' });
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

// Função que exibe os botões de solicitação de alteração dos dados sensíveis
async function exibeFormOpcoes(opcao) {
    // Chama a função que verifica se já existe alguma solicitação pendente de aprovação
    const { aviso } = verificaSolicitacoesPendentes(opcao);

    if(aviso !== '') {
        return warningAlert({ descricao: aviso });
    }

    const cpf = document.querySelector('#cpfCnpj').value;
    const nome = document.querySelector('#nome').value;
    const idCliente = document.querySelector('#idCliente').value;

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
        mask = cpf.length > 14 ? 'onfocus="maskCnpj(`swal-input`);"' : 'onfocus="maskCpf(`swal-input`);"';
    }else if(opcao === 'nome') {
        label = 'Nome'
        valor = nome;
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
        return warningAlert({descricao: 'Preencha corretamente o CPF/CNPJ!'});
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
        idCliente: idCliente,
        motivo: valores[1]
    }

    // Post da solicitação
    const response = await axios.post('/cliente/solicitacao', dados);

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
    const qtdSolicitacoesCpf = document.querySelector('#qtdSolicitacoesCpfCnpj').value;
    const qtdSolicitacoesNome = document.querySelector('#qtdSolicitacoesNome').value;
    let aviso = '';

    if(opcao == 'cpf') {
        if(qtdSolicitacoesCpf > 0) {
            aviso = 'Já existe uma solicitação de alteração do CPF pendente para esse cliente!';
        }
    }

    if(opcao == 'nome') {
        if(qtdSolicitacoesNome > 0) {
            aviso = 'Já existe uma solicitação de alteração do nome pendente para esse cliente!';
        }
    }

    return { aviso };
}