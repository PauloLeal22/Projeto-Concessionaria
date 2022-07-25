window.onload = () => {
    const tds = document.querySelectorAll('.td-dado');
    tds.forEach(td => {
        let tdCpf = td.classList.contains('td-cpf');
        if(tdCpf) {
            td.id = `td${td.innerText}`;
            maskCpf(td.id);
        }
    });

    const trs = document.querySelectorAll('tbody tr');
    trs.forEach(tr => {
        tr.addEventListener('click', (event) => abreAcao(event.target.closest('tr')));
    });

    const selectTipoSolicitacao = document.querySelector('#selectTipoSolicitacao');
    selectTipoSolicitacao.addEventListener('change', (event) => redireciona(event.target.value));
}

function redireciona(tipo) {
    location.href = `/usuarios/solicitacoes/${tipo}`;
}

async function abreAcao(tr){
    let statusSolicitacao = tr.children[9].innerText;

    if(statusSolicitacao !== 'Pendente') {
        statusSolicitacao = statusSolicitacao == 'Aprovado' ? 'aprovada' : 'reprovada';

        return warningAlert({ descricao: `Essa solicitação já foi ${statusSolicitacao}!` });
    }

    const idSolicitacao = tr.dataset.id;
    const solicitante = tr.children[0].innerText;
    const usuario = tr.children[1].innerText;
    const valorAtual= tr.children[2].innerText;
    const novoValor = tr.children[3].innerText;
    const motivo = tr.children[5].innerText;

    const campos = `
        <p style="text-align: left">Solicitante: ${solicitante}</p>
        <p style="text-align: left">Usuário: ${usuario}</p>
        <p style="text-align: left">Valor Atual: ${valorAtual}</p>
        <p style="text-align: left">Novo Valor: ${novoValor}</p>
        <p style="text-align: left">Motivo: ${motivo}</p>
        <textarea style="width: 98%; margin: 10px 0" id="swal2-textarea" class="swal2-textarea" rows="10" placeholder="Observações sobre a decisão"></textarea>
    `;

    const callbackConfirm = () => {
        return {
            observacao: document.querySelector('#swal2-textarea').value,
            novoStatus: 1
        }
    }

    const callbackDeny = () => {
        return {
            observacao: document.querySelector('#swal2-textarea').value,
            novoStatus: 0
        }
    }

    const valores = await formAlert({
        titulo: 'Solicitação',
        campos: campos,
        labelBotaoReprovar: 'Reprovar',
        labelBotaoConfirm: 'Aprovar'
    },
    callbackConfirm,
    callbackDeny
    );

    if(valores) {
        const tipoSolicitacao = document.querySelector('#selectTipoSolicitacao').value;
    
        const response = await axios.patch('/usuarios/solicitacao', {
            idSolicitacao,
            novoStatus: valores.novoStatus,
            observacao: valores.observacao,
            tipoSolicitacao
        });
    
        if(response.data.erro === false) {
            successAlert({ titulo: response.data.message });
    
            return setTimeout(() => {
                location.reload();
            }, 2000);
        }else {
            return warningAlert({ descricao: response.data.message });
        }
    }
}