let btnLogin = document.querySelector('#btnLogin');

btnLogin.addEventListener('click', () => verificarCampos());

async function verificarCampos(){
    const login = document.querySelector('#login');
    const senha = document.querySelector('#senha');

    if(login.value == '' || login.value == undefined){
        warningAlert({descricao: 'O campo "usuário" é de preenchimento obrigatório!'});
        return event.preventDefault();
    }

    if(senha.value == '' || senha.value == undefined){
        warningAlert({descricao: 'O campo "senha" é de preenchimento obrigatório!'});
        return event.preventDefault();
    }

    document.querySelector('#formLogin').setAttribute('action', '/auth');
    document.querySelector('#formLogin').setAttribute('method', 'post');
    document.querySelector('#formLogin').submit();
}

window.onload = () => {
    const erro = document.querySelector('#erro').value;
    if(erro !== ""){
        warningAlert({descricao: erro});
    }
}