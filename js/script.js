$(document).ready(function () {
	//canvas
	var c = document.getElementById("game-board");
	var ctx = c.getContext("2d");
	var cellSize = 15;
	var w = c.width / cellSize;
	var h = c.height / cellSize;
	var snake = [];
	var snakeInitialSize = 5;
	var food = { x: 0, y: 0 };
	var snakeColor;
	var foodColor;
	var gameSpeed;
	var dir = "right";
	var score = 0;
	var loop;
	var gameInProgress = false;
	var settingsOn = false;

	var color = new Array();
	color["yellow"] = "#ffd800";
	color["orange"] = "#ff6a00";
	color["green"] = "#00ff21";
	color["blue"] = "#0094ff";

	var speed = new Array();
	speed["slow"] = 120;
	speed["medium"] = 80;
	speed["fast"] = 40;

	function init() {
		window.addEventListener("keydown", keyPressed, false);
		snakeColor = color["green"];
		foodColor = color["yellow"];
		gameSpeed = 100;
	}

	function startNewGame() {
		gameInProgress = true;
		dir = "right";
		score = 0;
		updateScore(0);
		$(".overlay").hide();

		//create snake
		snake.length = 0;
		for (var i = snakeInitialSize; i > 0; i--) {
			snake.push({ x: i, y: 0 });
		}

		//create food
		placeFood();

		//game loop
		loop = setInterval(gameLoop, gameSpeed);
	}

	function placeFood() {
		do {
			food.x = Math.floor(Math.random() * w);
			food.y = Math.floor(Math.random() * h);
		}
		while (checkCollision(food.x, food.y));
	}

	function paintCell(x, y, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
		ctx.strokeStyle = "#000000";
		ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
	}

	function gameLoop() {
		ctx.clearRect(0, 0, c.width, c.height);

		//move snake
		var x = snake[0].x;
		var y = snake[0].y;

		if (dir == "right")
			x++;
		else if (dir == "left")
			x--;
		else if (dir == "up")
			y--;
		else if (dir == "down")
			y++;

		//eat food
		if (x == food.x && y == food.y) {
			snake.unshift({ x: x, y: y });
			placeFood();
			score++;
			updateScore();
		}
		//colision - game over
		else if (x >= w || x < 0 || y < 0 || y >= h || checkCollision(x, y)) {
			clearInterval(loop);
			$("#game-over").show();
			$("#final-score span").text(score);
			gameInProgress = false;
		}
		//move
		else {
			snake.pop();
			snake.unshift({ x: x, y: y });
		}

		//paint snake and food
		for (var i = 0; i < snake.length; i++)
			paintCell(snake[i].x, snake[i].y, snakeColor);
		paintCell(food.x, food.y, foodColor);
	}

	function checkCollision(x, y) {
		for (var i = 0; i < snake.length; i++) {
			if (x == snake[i].x && y == snake[i].y)
				return true;
		}

		return false;
	}

	function keyPressed(e) {
		if (e.keyCode == 38 && dir != "down" && gameInProgress)
			dir = "up";
		else if (e.keyCode == 39 && dir != "left" && gameInProgress)
			dir = "right";
		else if (e.keyCode == 40 && dir != "up" && gameInProgress)
			dir = "down";
		else if (e.keyCode == 37 && dir != "right" && gameInProgress)
			dir = "left";
		else if (e.keyCode == 13 && !gameInProgress && !settingsOn)
			startNewGame();
	}

	function updateScore() {
		$("#score span").text(score);
	}

	$("#settings-btn").click(function () {
		if (!gameInProgress) {
			$("#settings-panel").slideToggle(150);
			if (settingsOn) {
				settingsOn = false;
			}
			else {
				settingsOn = true;
			}
		}
	});

	$("#ok-btn").click(function () {
		settingsOn = false;
		$("#settings-panel").slideUp(150);
	});

	$("#settings-panel i").click(function () {
		var pressed = $(this);
		var s;

		$("#settings-panel i").removeClass("icon-selected");
		pressed.addClass("icon-selected");

		s = pressed.data("speed");
		gameSpeed = speed[s];
	});

	$("#settings-panel .color li").click(function () {
		var pressed = $(this);
		var col;

		pressed.siblings().removeClass("color-selected");
		pressed.addClass("color-selected");

		col = pressed.data("color");

		if (pressed.parent(".color").is("#snake-color")) {
			snakeColor = color[col];
		}
		else if (pressed.parent(".color").is("#food-color")) {
			foodColor = color[col];
		}
	});

	init();
});