void setup()
{
  size(400,400);
}

void draw(){  

	//BG
	background(129, 195, 230);

	//Text
	fill(255, 255, 255);
	var m = createFont ("fantasy",50);
	textFont (m,60);
	text ("Feliz Natal!",65,80);

	// Snow
	noStroke();
	ellipse(30,30,7,7);
	ellipse(47,62,7,7);
	ellipse(14,96,7,7);
	ellipse(30,125,7,7);
	ellipse(367,108,7,7);
	ellipse(360,125,7,7);
	ellipse(380,150,7,7);
	ellipse(313,166,7,7);
	ellipse(289,125,7,7);
	ellipse(130,150,7,7);

	// Ground
	fill(214, 203, 203);
	ellipse(150,400,515,100);

	// Torso
	fill(255, 255, 255);
	ellipse(200,315,170,150);

	// Bottons
	fill(32, 152, 161);
	ellipse(200,295,20,20);
	ellipse(200,330,20,20);

	// Scarf
	ellipse(195,248,85,50);
	quad(200,255,225,267,265,315,240,315);
	quad(220,265,225,255,270,280,260,295);

	// Head
	fill(255, 255, 255);
	ellipse(195,210,100,100);

	// Eyes
	fill(0, 0, 0);
	ellipse(180,210,10,10);
	ellipse(210,210,10,10);

	// Nose
	fill(255, 132, 0);
	triangle(195,225,250,230,195,235);

	//Mouth
	fill(0, 0, 0);
	ellipse(175,235,5,5);
	ellipse(182,245,5,5);
	ellipse(192,249,5,5);
	ellipse(202,249,5,5);
	ellipse(211,245,5,5);

	// Hat
	fill(0, 0, 0);
	ellipse(195,174,103,29);
	rect(160,140,70,30);
	fill(0, 0, 0);
	ellipse(195,138,70,20);
}

