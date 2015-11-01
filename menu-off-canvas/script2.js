var wrapper = $('.wrapper');

// Criando o event click para abrir o menu
$(function() {
  $('.toggle-menu').click(function() {
    menuAction();
  });
});

// Criando o event keyup para fechar menu ao pressionar ESC
$(document).keyup(function(e) {
    if (e.keyCode == 27) {
      if (wrapper.hasClass('show-menu')) {
        menuAction();
      }
    } 
});

// Função auxiliar para mostrar e esconder o menu
function menuAction() {
    if (wrapper.hasClass('show-menu')) {
        wrapper.removeClass('show-menu');
    } 
    else {
      wrapper.addClass('show-menu');
    }
}