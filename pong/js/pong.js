
// Cada tecla possui um valor, aqui assinalo uma variável mais fácil de identificar
// do que um número.
var KEY = {
	UP: 38,
	DOWN: 40,
	W: 87,
	S: 83
} 
//Variáveis Globais
var pingpong = {
	scoreA: 0,
	scoreB: 0
}

pingpong.pressedKeys = [];

pingpong.ball = {
	speed: 5,
	x: 150,
	y: 100,
	directionX:1,
	directionY:1
}

$(function(){
	//Determina um intervalo para o loop do jogo 30ms
	pingpong.timer = setInterval(gameloop, 30);

	//Guarda se foi a tecla para cima ou para baixo foi chamada
	$(document).keydown(function(e){
		pingpong.pressedKeys[e.which] = true;
	});
	$(document).keyup(function(e){
		pingpong.pressedKeys[e.which] = false;
	});
})


//Função Loop principal do jogo
function gameloop() {
	moveBall();
	movePaddles();
}

function moveBall(){
	//passando variáveis do playground e da bola
	var playgroundHeight = parseInt($("#playground").height());
	var playgroundWidth = parseInt($("#playground").width());
	var ball = pingpong.ball;

	// identificar as paredes

	// colisão parte de baixo
	// Retiro 20 da altura, pois é o tamanho da bolinha, assim ela 
	// não ultrapassa a parede e então volta
	if(ball.y + ball.speed*ball.directionY > (playgroundHeight-20)){
		ball.directionY = -1;
	}

	// colisão parte de cima
	if(ball.y + ball.speed*ball.directionY < 0){
		ball.directionY = 1;
	}

	// colisão direita
	if(ball.x + ball.speed*ball.directionX > (playgroundWidth-20)){
		ball.directionX = -1;
	}

	// colisão esquerda
	if(ball.x + ball.speed*ball.directionX < 0){
		ball.directionX = 1;
	}

	ball.x += ball.speed * ball.directionX;
	ball.y += ball.speed * ball.directionY;

	// verificar colisão com paddle

	// verificar paddle esquerdo
	var paddleAX = parseInt($("#paddleA").css("left"))+parseInt($("#paddleA").css("width"));
	var paddleAYBottom = parseInt($("#paddleA").css("top"))+parseInt($("#paddleA").css("height"));
	var paddleAYTop = parseInt($("#paddleA").css("top"));
	if (ball.x + ball.speed*ball.directionX < paddleAX)
	{
		if (ball.y + ball.speed*ball.directionY <= paddleAYBottom && 
			ball.y + ball.speed*ball.directionY >= paddleAYTop)
		{
			ball.directionX = 1;
		}
	}


	// verificar paddle direito
	var paddleBX = parseInt($("#paddleB").css("left"));
	var paddleBYBottom = parseInt($("#paddleB").css("top"))+parseInt($("#paddleB").css("height"));
	var paddleBYTop = parseInt($("#paddleB").css("top"));
	if (ball.x + ball.speed*ball.directionX >= (paddleBX-10))
	{
		if (ball.y + ball.speed*ball.directionY <= paddleBYBottom && 
			ball.y + ball.speed*ball.directionY >= paddleBYTop)
		{
			ball.directionX = -1;
		}
	}

	// verificar lado direito

	//Lembrar de sempre que 
	if(ball.x + ball.speed*ball.directionX > (playgroundWidth-20)){
		// Player B Perdeu
		pingpong.scoreA++;
		$("#scoreA").html(pingpong.scoreA);

		// resetar a bola
		ball.x = 250;
		ball.y = 100;

		$("#ball").css({
			"left": ball.x,
			"top": ball.y
		});
		ball.directionX = -1; 
	}

	
	if(ball.x + ball.speed*ball.directionX < 0){
		// Player A Perdeu
		pingpong.scoreB++;
		$("#scoreB").html(pingpong.scoreB);

		// resetar a bola
		ball.x = 150;
		ball.y = 100;

		$("#ball").css({
			"left": ball.x,
			"top": ball.y
		});
		ball.directionX = 1; 
	}

	//movimentar a bola
	$("#ball").css({
		top: ball.y,
		left: ball.x
	});
}

function movePaddles(){
	//com o loop fazendo a identificação das teclas, agora mover os paddles

	//identificar se apertou para cima e subir o top 5px
	if(pingpong.pressedKeys[KEY.UP]){
		var top = parseInt($("#paddleB").css("top"));
		$("#paddleB").css("top", top-5);
	}

	//identificar se apertou para baixo e descer o top 5px
	if(pingpong.pressedKeys[KEY.DOWN]){
		var top = parseInt($("#paddleB").css("top"));
		$("#paddleB").css("top", top+5);
	}

	//identificar se apertou W e subir o top 5px
	if(pingpong.pressedKeys[KEY.W]){
		var top = parseInt($("#paddleA").css("top"));
		$("#paddleA").css("top", top-5);
	}

	//identificar se apertou S e descer o top 5px
	if(pingpong.pressedKeys[KEY.S]){
		var top = parseInt($("#paddleA").css("top"));
		$("#paddleA").css("top", top+5);
	}

}