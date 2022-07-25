$("#li-carros").click(() => toggleMenu('carros'));
$("#li-compras").click(() => toggleMenu('compras'));
$("#li-clientes").click(() => toggleMenu('clientes'));
$("#li-usuarios").click(() => toggleMenu('usuarios'));

function toggleMenu(item) {
    $(`#sub-${item}`).toggle( 600, function() {
        if($(`#i-${item}`).hasClass('fa-chevron-down')){
            $(`#i-${item}`).attr('class', 'fas fa-chevron-up i-menu');
        }else{
            $(`#i-${item}`).attr('class', 'fas fa-chevron-down i-menu');
        }
    });
}