function disableButton(idButton) {
    const button = document.querySelector(`#${idButton}`);
    const spanButton = document.querySelector(`#${idButton} span`);

    button.setAttribute('disabled', 'disabled');

    spanButton.innerHTML = `<img class="gif-loading" src="/assets/images/loading.gif" alt="Loading">`;
}

function enableButton(idButton, text) {
    const button = document.querySelector(`#${idButton}`);
    const spanButton = document.querySelector(`#${idButton} span`);

    button.removeAttribute('disable');

    spanButton.innerHTML = text;
}