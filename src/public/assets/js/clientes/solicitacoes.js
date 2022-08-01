window.onload = () => {
    const tds = document.querySelectorAll('.td-dado');

    // Aplica a máscara de cpf para todos os tds de cpf
    tds.forEach(td => {
        let tdCpf = td.classList.contains('td-cpf');
        if(tdCpf) {
            td.id = `td${td.innerText}`;
            if(td.innerText.length > 11) {
                maskCnpj(td.id);
            } else {
                maskCpf(td.id);
            }
        }
    });

    const trs = document.querySelectorAll('tbody tr');

    // Adiciona a função que exibe o formulário de aprovação a todos os trs
    trs.forEach(tr => {
        tr.addEventListener('click', (event) => abreAcao(event.target.closest('tr')));
    });

    const selectTipoSolicitacao = document.querySelector('#selectTipoSolicitacao');

    // Adiciona a função que redireciona para a página de cada tipo de solicitação (cpf, login ou nome)
    selectTipoSolicitacao.addEventListener('change', (event) => redireciona(event.target.value));
}

// Função que redireciona para a página de cada tipo de solicitação
function redireciona(tipo) {
    location.href = `/clientes/solicitacoes/${tipo}`;
}

// Função que abre o formulário de aprovação ou exibe um aviso caso a aprovação não esteja pendente
async function abreAcao(tr){
    let statusSolicitacao = tr.children[9].innerText;

    if(statusSolicitacao !== 'Pendente') {
        statusSolicitacao = statusSolicitacao == 'Aprovado' ? 'aprovada' : 'reprovada';

        return warningAlert({ descricao: `Essa solicitação já foi ${statusSolicitacao}!` });
    }

    // Pega os principais dados da solicitação
    const idSolicitacao = tr.dataset.id;
    const solicitante = tr.children[0].innerText;
    const cliente = tr.children[1].innerText;
    const valorAtual= tr.children[2].innerText;
    const novoValor = tr.children[3].innerText;
    const motivo = tr.children[5].innerText;

    // Cria os campos do formulário
    const campos = `
        <p style="text-align: left">Solicitante: ${solicitante}</p>
        <p style="text-align: left">Cliente: ${cliente}</p>
        <p style="text-align: left">Valor Atual: ${valorAtual}</p>
        <p style="text-align: left">Novo Valor: ${novoValor}</p>
        <p style="text-align: left">Motivo: ${motivo}</p>
        <textarea style="width: 98%; margin: 10px 0" id="swal2-textarea" class="swal2-textarea" rows="10" placeholder="Observações sobre a decisão"></textarea>
    `;

    // Cria a callback que retornará os dados de aprovação
    const callbackConfirm = () => {
        return {
            observacao: document.querySelector('#swal2-textarea').value,
            novoStatus: 1
        }
    }

    // Cria a callback que retornará os dados de reprovação
    const callbackDeny = () => {
        return {
            observacao: document.querySelector('#swal2-textarea').value,
            novoStatus: 0
        }
    }

    // Exibe o formulário
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
    
        // Envia os dados para o controller
        const response = await axios.patch('/clientes/solicitacao', {
            idSolicitacao,
            novoStatus: valores.novoStatus,
            observacao: valores.observacao,
            tipoSolicitacao
        });
    
        if(response.data.erro === false) {
            successAlert({ titulo: response.data.message });
    
            // Recarrega a página
            return setTimeout(() => {
                location.reload();
            }, 2000);
        }else {
            return warningAlert({ descricao: response.data.message });
        }
    }
}