function formatDate(data){
    const dia = data.getDate() <= 9 ?  `0${data.getDate()}` : data.getDate();
    const mes = data.getMonth() <= 8 ?  `0${data.getMonth() + 1}` : data.getMonth() + 1;
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

export { formatDate };