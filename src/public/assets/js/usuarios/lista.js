window.onload = () => {
    const tds = document.querySelectorAll('.td-dado');
    const iconesBloquear = document.querySelectorAll('.icone-bloquear');
    const iconesDesbloquear = document.querySelectorAll('.icone-desbloquear');

    const btnNovousuario = document.querySelector('#btnNovoUsuario');
    const pesquisa = document.querySelector('#pesquisa');
    
    tds.forEach(tr => tr.addEventListener('click', () => selecionaUsuario(event.target.closest('tr').dataset.id)));
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

    pesquisa.addEventListener('keyup', pesquisaUsuario);

    btnNovousuario.addEventListener('click', direcionarPagina);
}

function selecionaUsuario(idUsuario) {
    location.href = `/usuario/${idUsuario}`;
}

async function alteraStatusUsuario(idUsuario) {
    const response = await axios.post('/usuario/status', { idUsuario: idUsuario });

    if(response.data.erro == false) {
        successAlert({ titulo: response.data.message });

        return setTimeout(() => {
            location.reload();
        }, 2000);
    }else {
        return warningAlert({ descricao: response.data.message });
    }
}

function direcionarPagina() {
    location.href = '/usuarios/cadastro';
}

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