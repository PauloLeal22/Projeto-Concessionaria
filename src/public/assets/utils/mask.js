function maskCep(input) {
    $(`#${input}`).mask('00000-000');
}

function maskCpf(input) {
    $(`#${input}`).mask('000.000.000-00', {reverse: true});
}

function maskCnpj(input) {
    $(`#${input}`).mask('00.000.000/0000-00', {reverse: true});
}

function maskData(input) {
    $(`#${input}`).mask('00/00/0000');
}

function maskCel(input) {
    $(`#${input}`).mask('(00)00000-0000');
}

function maskTel(input) {
    $(`#${input}`).mask('(00)0000-0000');
}