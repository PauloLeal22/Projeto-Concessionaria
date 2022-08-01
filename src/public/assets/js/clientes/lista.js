window.onload = () => {
    // Pega todos os tds
    const tds = document.querySelectorAll('.td-dado');

    const btnNovoCliente = document.querySelector('#btnNovoCliente');
    const pesquisa = document.querySelector('#pesquisa');
    
    // Adiciona a função de redirecionamento para a página do cliente a todos os tds
    tds.forEach(td => {
        if(td.classList.contains('td-cpf')){
            td.id = `td-${td.innerText}`;
            if(td.innerText.length > 11) {
                maskCnpj(td.id);
            } else {
                maskCpf(td.id);
            }
        }
        td.addEventListener('click', event => selecionaCliente(event.target.closest('tr').dataset.id))
    });

    // Adiciona a função de pesquisa ao campo de pesquisa
    pesquisa.addEventListener('keyup', pesquisaCliente);

    // Adiciona a função de redirecionamento para a página de cadastro de cliente ao botão de novo cliente
    btnNovoCliente.addEventListener('click', direcionarPagina);
}

// Função que redireciona para a página do cliente
function selecionaCliente(idCliente) {
    location.href = `/cliente/${idCliente}`;
}

// Função que redireciona para a página de novo cliente
function direcionarPagina() {
    location.href = '/clientes/cadastro';
}

// Função que filtra os clientes
function pesquisaCliente() {
    const trs = document.querySelectorAll('.tabela tbody tr');
    const pesquisa = document.querySelector('#pesquisa').value.toUpperCase();

    trs.forEach(tr => {
        if(tr.querySelector('.td-nome').innerText.toUpperCase().indexOf(pesquisa) == -1) {
            tr.style.display = 'none';
        }else {
            tr.style.display = '';
        }
    });
}