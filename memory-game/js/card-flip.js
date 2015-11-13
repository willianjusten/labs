// Guardando as variáveis das cartas
var matchingGame = {
	acertos : 0,
	erros: 0
}

matchingGame.deck = [

	'cardAK', 'cardAK',
	'cardAQ', 'cardAQ',
	'cardBK', 'cardBK',
	'cardBQ', 'cardBQ',
	'cardCK', 'cardCK',
	'cardCQ', 'cardCQ'
];



$(function(){

	// Embaralhar as cartas
	matchingGame.deck.sort(shuffle);
	// CLONA 12 CARTAS
	for(var i=0; i<11; i++){
		$(".card:first-child").clone().appendTo("#cards");
	}

	// Inicializa cada carta em suas posições
	$("#cards").children().each(function(index){
		$(this).css({
			"left" : ($(this).width() + 20) * ( index % 4 ),
			"top"  : ($(this).height() + 20 ) * Math.floor(index/4)
		});

		//pega um padrão do baralho
		var pattern = matchingGame.deck.pop();
		// aplica o padrão na parte de trás da carta
		$(this).find(".back").addClass(pattern);
		// uni o padrão com o evento
		$(this).attr("data-pattern", pattern);
		// identifica o clique na div
		$(this).click(selectCard);
	});
});

function shuffle() {
	return 0.5 - Math.random();
}

function selectCard() {
	// nada acontece quando duas cartas já foram escolhidas
	if ($(".card-flipped").size() > 1){
		return;
	}

	$(this).addClass("card-flipped");

	//verifica o padrão de ambas as cartas com 0.7s
	if($(".card-flipped").size() == 2) {
		setTimeout(checkPattern, 700);
	}
}

function checkPattern() {

	// se as cartas forem iguais, remove a classe card-flipped e adiciona card-removed
	if(isMatchPattern()){
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
		$(".card-removed").bind("webkitTransitionEnd", removeTookCards);

		// contabiliza acerto
		matchingGame.acertos++;
		// escreve na tela
		$("#acertos").html(matchingGame.acertos);

		if(matchingGame.acertos == 6 ){
			$("#win").css("display", "block");
		}
	}
	else {
		$(".card-flipped").removeClass("card-flipped");

		// contabiliza erro
		matchingGame.erros++;
		// escreve na tela
		$("#erros").html(matchingGame.erros);
	}
}

function isMatchPattern() {
	var cards = $(".card-flipped");
	var pattern = $(cards[0]).data("pattern");
	var anotherPattern = $(cards[1]).data("pattern");

	return (pattern == anotherPattern);
}

function removeTookCards() {
	$(".card-removed").remove();
}

// Timer

