function warningAlert(content) {
    const { titulo, descricao } = content;

    return Swal.fire({
        icon: 'warning',
        title: titulo ? titulo : 'Atenção!',
        text: descricao,
        confirmButtonColor: '#1761A0'
    });
}

function successAlert(content) {
    const { titulo } = content;

    return Swal.fire({
        icon: 'success',
        title: titulo,
        showConfirmButton: false,
        timer: 2000
    });
}

function confirmAlert(content, callback) {
    const { titulo, descricao, labelBotao, idRegistro } = content;

    Swal.fire({
        title: titulo ? titulo : 'Atenção!',
        text: descricao,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1761A0',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Calcelar',
        confirmButtonText: labelBotao
      }).then((result) => {
        if (result.isConfirmed) {
          callback(idRegistro);
        }
      })
}

async function formAlert(content, callbackConfirm, callbackDeny = null) {
  const { titulo, campos, labelBotaoReprovar, labelBotaoConfirm } = content;

  const { value: response } = await Swal.fire({
    title: titulo,
    html: campos,
    showCancelButton: true,
    confirmButtonColor: '#1761A0',
    cancelButtonColor: labelBotaoReprovar ? '#6e7881': '#d33',
    denyButtonColor: '#d33',
    confirmButtonText: labelBotaoConfirm ? labelBotaoConfirm : 'OK',
    cancelButtonText: 'Calcelar',
    showDenyButton: labelBotaoReprovar ? true : false,
    denyButtonText: labelBotaoReprovar,
    preConfirm: callbackConfirm,
    preDeny: callbackDeny
  })

  return response;
}

function infoAlert(content) {
  const { titulo, descricao } = content;

  Swal.fire({
      title: titulo,
      html: descricao,
      showCancelButton: false
    })
}

