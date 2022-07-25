function limpaFormCep() {
    //Limpa valores do formulário de cep.
    document.querySelector('#logradouro').value = ("");
    document.querySelector('#bairro').value = ("");
    document.querySelector('#cidade').value = ("");
}

function preencheCampos(conteudo) {
    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.
        document.querySelector('#logradouro').value = (conteudo.logradouro);
        document.querySelector('#bairro').value = (conteudo.bairro);
        document.querySelector('#cidade').value = (conteudo.localidade);

        // Preenche o estado
        const estados = document.querySelectorAll('#estado .option');
        for(i = 0; i < estados.length; i++){
            if(estados[i].value === conteudo.uf){
                estados[i].setAttribute('selected', 'selected');
            };
        }

        if(!conteudo.logradouro && conteudo.localidade) {
            document.querySelector('#logradouro').classList.remove('readonly');
            document.querySelector('#logradouro').removeAttribute('readonly');
            document.querySelector('#bairro').classList.remove('readonly');
            document.querySelector('#bairro').removeAttribute('readonly');
        }else{
            document.querySelector('#logradouro').classList.add('readonly');
            document.querySelector('#logradouro').setAttribute('readonly', 'readonly');
            document.querySelector('#bairro').classList.add('readonly');
            document.querySelector('#bairro').setAttribute('readonly', 'readonly');
        }
    }
    else {
        //CEP não Encontrado.
        limpaFormCep();
        warningAlert({ descricao: 'CEP não encontrado.' });
    }
}

function pesquisaCep(valor) {
    //Nova variável "cep" somente com dígitos.
    const cep = valor.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {
        

        //Expressão regular para validar o CEP.
        const validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if(validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
            document.querySelector('#logradouro').value = "...";
            document.querySelector('#bairro').value = "...";
            document.querySelector('#cidade').value = "...";

            //Cria um elemento javascript.
            const script = document.createElement('script');

            //Sincroniza com o callback.
            script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=preencheCampos';

            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);

        }
        else {
            //cep é inválido.
            limpaFormCep();
            warningAlert({ descricao: 'Formato de CEP inválido.' });
        }
    }
    else {
        //cep sem valor, limpa formulário.
        limpaFormCep();
    }
}