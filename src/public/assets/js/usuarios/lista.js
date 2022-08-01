window.onload = () => {
    // Pega todos os tds e icones
    const tds = document.querySelectorAll('.td-dado');
    const iconesBloquear = document.querySelectorAll('.icone-bloquear');
    const iconesDesbloquear = document.querySelectorAll('.icone-desbloquear');

    const btnNovousuario = document.querySelector('#btnNovoUsuario');
    const pesquisa = document.querySelector('#pesquisa');
    
    // Adiciona a função de redirecionamento para a página do usuário a todos os tds
    tds.forEach(tr => tr.addEventListener('click', () => selecionaUsuario(event.target.closest('tr').dataset.id)));

    // Adiciona a função de exibir o formulário de bloqueio de usuário a todos os icones de bloqueio
    iconesBloquear.forEach(icone => icone.addEventListener('click', (event) => {
            confirmAlert(
                {
                    descricao: 'Deseja realmente bloquear o usuário?',
                    labelBotao: 'Sim, bloquear o usuário!',
                    idRegistro: event.target.closest('tr').dataset.id
                },
                alteraStatusUsuario
            );
        })
    );

    // Adiciona a função de exibir o formulário de desbloqueio de usuário a todos os icones de desbloqueio
    iconesDesbloquear.forEach(icone => icone.addEventListener('click', (event) => {
            confirmAlert(
                {
                    descricao: 'Deseja realmente desbloquear o usuário?',
                    labelBotao: 'Sim, desbloquear o usuário!',
                    idRegistro: event.target.closest('tr').dataset.id
                },
                alteraStatusUsuario
            );
        })
    );

    // Adiciona a função de pesquisa ao campo de pesquisa
    pesquisa.addEventListener('keyup', pesquisaUsuario);

    // Adiciona a função de redirecionamento para a página de cadastro de usuário ao botão de novo usuário
    btnNovousuario.addEventListener('click', direcionarPagina);
}

// Função que redireciona para a página do usuário
function selecionaUsuario(idUsuario) {
    location.href = `/usuario/${idUsuario}`;
}

// Função que bloqueia ou desbloqueia o usuário
async function alteraStatusUsuario(idUsuario) {
    const response = await axios.post('/usuario/status', { idUsuario: idUsuario });

    if(response.data.erro == false) {
        successAlert({ titulo: response.data.message });

        // Recarrega a página
        return setTimeout(() => {
            location.reload();
        }, 2000);
    }else {
        return warningAlert({ descricao: response.data.message });
    }
}

// Função que redireciona para a página de novo usuário
function direcionarPagina() {
    location.href = '/usuarios/cadastro';
}

// Função que filtra os usuários
function pesquisaUsuario() {
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