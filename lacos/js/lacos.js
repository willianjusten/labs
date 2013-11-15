// função para limpar o canvas
function clear(ctx) { 
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height); 
}

// recebe os valores dos círculos e guarda as informações
function Circle(x,y,radius) {
	this.x = x;
	this.y = y;
	this.radius = radius;
}

// guarda os dados das linhas
function Line(startPoint, endPoint, thickness) {
	this.startPoint = startPoint;
	this.endPoint = endPoint;
	this.thickness = thickness;
}

// variáveis do jogo
var lacosGame = {
	circles: [],
	thinLineThickness: 1,
	boldLineThickness: 5,
	lines: [],
	currentLevel: 0,
	progressPercentage: 0
};

//variáveis das fases (planejando separar o JSON depois e adicionar mais levels)
lacosGame.levels = 
[
	{
		"level" : 0,
		"circles" : [{"x" : 400, "y" : 156},
					 {"x" : 381, "y" : 241},
					 {"x" : 84, "y" : 233},
					 {"x" : 88, "y" : 73}],

		"relationship" : {
			"0" : {"connectedPoints" : [1,2]},
			"1" : {"connectedPoints" : [0,3]},
			"2" : {"connectedPoints" : [0,3]},
			"3" : {"connectedPoints" : [1,2]},
		}
	},

	{
		"level" : 1,
		"circles" : [{"x" : 550, "y" : 110},
					 {"x" : 550, "y" : 240},
					 {"x" : 230, "y" : 241},
					 {"x" : 230, "y" : 110}],

		"relationship" : {
			"0" : {"connectedPoints" : [1,2,3]},
			"1" : {"connectedPoints" : [0,2,3]},
			"2" : {"connectedPoints" : [0,1,3]},
			"3" : {"connectedPoints" : [0,1,2]}
		}
	},

	{
		"level" : 2,
		"circles" : [{"x" : 222, "y" : 155},
					 {"x" : 383, "y" : 109},
					 {"x" : 523, "y" : 156},
					 {"x" : 520, "y" : 236},
					 {"x" : 378, "y" : 276},
					 {"x" : 225, "y" : 228}],

		"relationship" : {
			"0" : {"connectedPoints" : [2,3,4]},
			"1" : {"connectedPoints" : [3,5]},
			"2" : {"connectedPoints" : [0,4,5]},
			"3" : {"connectedPoints" : [0,1,5]},
			"4" : {"connectedPoints" : [0,2]},
			"5" : {"connectedPoints" : [1,2,3]}
		} 
	}	

];

// função para determinar os objetos do level
function setupCurrentLevel() {
	lacosGame.circles = [];
	var level = lacosGame.levels[lacosGame.currentLevel];
	for (var i=0; i<level.circles.length; i++) {
		lacosGame.circles.push(new Circle(level.circles[i].x, level.circles[i].y, 10));
	}
	
	connectCircles();
	updateLineIntersection();
}

// função para verificar se o jogo foi completo
function checkLevelCompleteness() {
	if ($("#progress").html() == "100") {
		if (lacosGame.currentLevel+1 < lacosGame.levels.length)
			lacosGame.currentLevel++;
		setupCurrentLevel();
	}
}



// desenha as linhas
function drawLine(ctx, x1, y1, x2, y2, thickness) {
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineWidth = thickness;
	ctx.strokeStyle = "#cfc";
	ctx.stroke();
}

// função para desenhar o circulo
function drawCircle (ctx, x, y, radius) {
	// criando o gradiente
	var circle_gradient = ctx.createRadialGradient(x-3,y-3,1, x, y, radius);
	circle_gradient.addColorStop(0, "#fff");
	circle_gradient.addColorStop(1, "#cc0");
	ctx.fillStyle = circle_gradient;

	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

// função ready do jogo
$(function(){

	var canvas = document.getElementById('game');
	var ctx = canvas.getContext("2d");

	// desenha a tela inicial do jogo
	var bg_gradient = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
	bg_gradient.addColorStop(0, "#cccccc");
	bg_gradient.addColorStop(1, "#efefef");

	ctx.fillStyle = bg_gradient;
	ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);

	// escreve o texto de loading
	ctx.font = "34px 'Rock Salt'";
	ctx.textAlign = "center";
	ctx.fillStyle = "#333";
	ctx.fillText("Carregando...", ctx.canvas.width/2, ctx.canvas.height/2);

	// define o tamanho dos círculos
	var circleRadius = 10;

	// faz as chamadas principais para iniciar o jogo
	setupCurrentLevel();
	connectCircles();
	updateLineIntersection();


	// chamada para mostrar os sprites de guia
	lacosGame.guide = new Image();
	lacosGame.guide.onload = function() {
		lacosGame.guideReady = true;

		lacosGame.guideFrame = 0;
		setInterval(guideNextFrame, 500);
	}
	lacosGame.guide.src="img/guide_sprite.png";


	// funções para identificar o mouse
	$("#game").mousedown(function(e) {
		var canvasPosition = $(this).offset();
		var mouseX = e.offsetX || 0;
		var mouseY = e.offsetY || 0; 

		for(var i=0;i<lacosGame.circles.length;i++){
			var circleX = lacosGame.circles[i].x;
			var circleY = lacosGame.circles[i].y;
			var radius = lacosGame.circles[i].radius;

			if (Math.pow(mouseX-circleX,2) + Math.pow(mouseY-circleY,2) < Math.pow(radius,2)) {
				lacosGame.targetCircle = i;
				break;
			}
		}
	});

	$("#game").mousemove(function(e) {
		if (lacosGame.targetCircle != undefined)	{
			var canvasPosition = $(this).offset();
			var mouseX = e.offsetX || 0;
			var mouseY = e.offsetY || 0;
			var radius = lacosGame.circles[lacosGame.targetCircle].radius;
			lacosGame.circles[lacosGame.targetCircle] = new Circle(mouseX, mouseY,radius); 
		}

		connectCircles();
		updateLineIntersection();
		updateLevelProgress();
	});

	// limpa após soltar o botão do mouse
	$("#game").mouseup(function(e) {
		lacosGame.targetCircle = undefined;

		checkLevelCompleteness();
	});

	// determina o loop do jogo
	setInterval(gameloop, 30);
});

// função para conectar os círculos
function connectCircles(){

	// conecta os círculos com as linhas
	var level = lacosGame.levels[lacosGame.currentLevel];
	lacosGame.lines.length = 0;
	for (var i in level.relationship) {
		var connectedPoints = level.relationship[i].connectedPoints;
		var startPoint = lacosGame.circles[i];
		for (var j in connectedPoints) {
			var endPoint = lacosGame.circles[connectedPoints[j]];
			lacosGame.lines.push(new Line(startPoint, endPoint, lacosGame.thinLineThickness));
		}
	}
}

// função para calcular o progresso no level
function updateLevelProgress()
{
	// check the lacos progress of the level
	var progress = 0;
	for (var i=0;i<lacosGame.lines.length;i++) {
		if (lacosGame.lines[i].thickness == lacosGame.thinLineThickness) {
			progress++;
		}
	}
	lacosGame.progressPercentage = Math.floor(progress/lacosGame.lines.length*100);
	$("#progress").html(lacosGame.progressPercentage);
	
	// display the current level
	$("#level").html(lacosGame.currentLevel);
	
	
}

// loop do jogo
function gameloop() { 

	var canvas = document.getElementById('game'); 
	var ctx = canvas.getContext('2d');
	clear(ctx);

	// Escreve o progresso
	ctx.font = "24px 'Rock Salt'";
	ctx.textAlign = "left";
	ctx.Baseline = "bottom";
	ctx.fillStyle = "#fff";
	ctx.fillText("Nível: "+lacosGame.currentLevel+" Completo: "+lacosGame.progressPercentage+"%", 60, ctx.canvas.height-70);


	// desenha as linhas
	for(var i=0;i<lacosGame.lines.length;i++) {
		var line = lacosGame.lines[i];
		var startPoint = line.startPoint;
		var endPoint = line.endPoint;
		var thickness = line.thickness;
		drawLine(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, thickness);
	}
	// desenha os círculos
	for(var i=0;i<lacosGame.circles.length;i++) {
		var circle = lacosGame.circles[i];
		drawCircle(ctx, circle.x, circle.y, circle.radius);
	}

	if(lacosGame.currentLevel == 0 && lacosGame.guideReady) {
		// cada sprite tem 80x130
		var nextFrameX = lacosGame.guideFrame * 80;
		ctx.drawImage(lacosGame.guide, nextFrameX, 0, 80, 130, 325, 130, 80, 130);
	}
}

// função para chamar os sprites
function guideNextFrame() {
	lacosGame.guideFrame++;

	// só existem 6 sprites, passando do 6 volta ao primeiro
	if(lacosGame.guideFrame>5){
		lacosGame.guideFrame = 0;
	}
}

// função para identificar a interseção
function isIntersect(line1, line2) {

	// converte a linha 1 na forma geral ax+by = c
	var a1 = line1.endPoint.y - line1.startPoint.y;
	var b1 = line1.startPoint.x - line1.endPoint.x;
	var c1 = a1 * line1.startPoint.x + b1 * line1.startPoint.y;

	// converte a linha 1 na forma geral ax+by = c
	var a2 = line2.endPoint.y - line2.startPoint.y;
	var b2 = line2.startPoint.x - line2.endPoint.x;
	var c2 = a2 * line2.startPoint.x + b2 * line2.startPoint.y;

	// determina a interseção das retas 
	var d = a1*b2 - a2*b1;

	// será paralela quando d = 0
	if (d == 0) {
		return false;
	}
	else {
		var x = (b2*c1 - b1*c2) / d;
		var y = (a1*c2 - a2*c1) / d;

		// verifica se a interseção está em todos os segmentos das linhas
		if ((isInBetween(line1.startPoint.x, x, line1.endPoint.x) || isInBetween(line1.startPoint.y, y, line1.endPoint.y)) &&
		(isInBetween(line2.startPoint.x, x, line2.endPoint.x) || isInBetween(line2.startPoint.y, y, line2.endPoint.y))) {

			return true; 
		}
	}

	return false;
}

function isInBetween(a, b, c) {
	// retorna falso se b for próximo ou igual a "a" ou "c"
	// determina que se a diferença for menor que 0.000001, então é igual

	if (Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001) {
		return false;
	}
	// retorna true se b estiver entre a e c
	return (a < b && b < c) || (c < b && b < a);
}

function updateLineIntersection() {
	// verifica a interseção e deixa as linhas mais grossas
	for (var i=0;i<lacosGame.lines.length;i++) {
		for(var j=0;j<i;j++) {
			var line1 = lacosGame.lines[i];
			var line2 = lacosGame.lines[j];
			// verifica qual linha está cruzando e deixa grossa
			if (isIntersect(line1, line2)) {
				line1.thickness = lacosGame.boldLineThickness;
				line2.thickness = lacosGame.boldLineThickness;
			} 
		}
	}
}