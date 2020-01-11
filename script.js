var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.setAttribute("width", window.innerWidth);
canvas.setAttribute("height", window.innerHeight);
ctx.strokeStyle = "white";
ctx.fillStyle = "white";

var laneWidth = Math.min(canvas.width, canvas.height) / 4;
var laneStartPos = (canvas.width - laneWidth * 4) / 2;
var lines = [laneStartPos, laneStartPos + laneWidth, laneStartPos + laneWidth * 2, laneStartPos + laneWidth * 3, laneStartPos + laneWidth * 4];
var lanes = [laneStartPos + laneWidth / 2, laneStartPos + laneWidth / 2 * 3, laneStartPos + laneWidth / 2 * 5, laneStartPos + laneWidth / 2 * 7];
var linePattern = [{color: "white", width: 5}, {color: "gray", width: 5}, {color: "white", width: 10}, {color: "gray", width: 5}, {color: "white", width: 5}];

var playerSpeed = laneWidth / 5;
var player = {left: {x: lanes[0], y: canvas.height - laneWidth / 3, dx: -playerSpeed}, right: {x: lanes[3], y: canvas.height - laneWidth / 3, dx: playerSpeed}};

var spawnTimer = -30;
var spawnSpeed = 5;
var blockSpeed = 10;
var blockAcceleration = 0;
var blocks = [];

var score = 0;
var paused = false;

function frame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//document.getElementById("speed").innerHTML = "Speed: " + blockSpeed.toFixed(2);
	//document.getElementById("score").innerHTML = "Score: " + score;

	collision();

	spawnBlocks();

	moveBlocks();
	movePlayer();

	draw();
	
	requestAnimationFrame(frame);
}


function reset() {
	spawnTimer = -30;
	player = {left: {x: lanes[0], y: canvas.height - laneWidth / 3, dx: -playerSpeed}, right: {x: lanes[3], y: canvas.height - laneWidth / 3, dx: playerSpeed}};
	blocks = [];
}


function collision() {
	for (var i = 0; i < blocks.length; ++i) {
		if (Math.hypot(blocks[i].x - player.left.x, blocks[i].y - player.left.y) < laneWidth/3 || Math.hypot(blocks[i].x - player.right.x, blocks[i].y - player.right.y) < laneWidth/3) {
			reset();
		}
	}
}


document.onkeydown = function(e) {
	if(e.keyCode == 65) {  // a
		player.left.dx = -playerSpeed;
	}
	if(e.keyCode == 68) {  // d
		player.left.dx = playerSpeed;	
	}

	if(e.keyCode == 74) {  // j
		player.right.dx = -playerSpeed;
	}
	if(e.keyCode == 76) {  // k
		player.right.dx = playerSpeed;
	}
}

document.ontouchstart = function(e) {
	if (e.touches[e.targetTouches.length - 1].clientX <= canvas.width / 2) {
		player.left.dx *= -1;
	}

	if (e.touches[e.targetTouches.length - 1].clientX >= canvas.width / 2) {
		player.right.dx *= -1;
	}
}

function movePlayer() {
	player.left.x += player.left.dx;
	player.left.x = (player.left.x < lanes[0]) ? lanes[0] : player.left.x;
	player.left.x = (player.left.x > lanes[1]) ? lanes[1] : player.left.x;

	player.right.x += player.right.dx;
	player.right.x = (player.right.x < lanes[2]) ? lanes[2] : player.right.x;
	player.right.x = (player.right.x > lanes[3]) ? lanes[3] : player.right.x;
}

function drawPlayer() {
	ctx.beginPath();
	ctx.arc(player.left.x, player.left.y, laneWidth / 6, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.arc(player.right.x, player.right.y, laneWidth / 6, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
}


function spawnBlocks() {
	++spawnTimer;

	if (spawnTimer == Math.round((60/(blockSpeed/spawnSpeed))/2)) {
		blocks.push({x: lanes[Math.floor(Math.random()*2)], y: -laneWidth/6});
	}
	else if (spawnTimer >= Math.round(60/(blockSpeed/spawnSpeed))) {
		blocks.push({x: lanes[Math.floor(Math.random()*2)+2], y: -laneWidth/6});

		spawnTimer = 0;
	}
}

function moveBlocks() {
	for (var i = 0; i < blocks.length; ++i) {
		blocks[i].y += blockSpeed;

		if (blocks[i].y > canvas.height + laneWidth/6) {
			blocks.splice(i,1);
			++score;
			--i;
		}
	}

	blockSpeed += blockAcceleration;
}

function drawBlocks() {
	for (var i = 0; i < blocks.length; ++i) {
		ctx.beginPath();
		ctx.rect(blocks[i].x - laneWidth/6, blocks[i].y - laneWidth/6, laneWidth/3, laneWidth/3);
		ctx.closePath();
		ctx.fill();
	}
}


function draw() {
	for (var i = 0; i < lines.length; ++i) {
		ctx.strokeStyle = linePattern[i].color;
		ctx.lineWidth = linePattern[i].width;

		ctx.beginPath();
		ctx.moveTo(lines[i], 0);
		ctx.lineTo(lines[i], canvas.height);
		ctx.closePath();
		ctx.stroke();
	}

	drawPlayer();
	drawBlocks();
}

frame();