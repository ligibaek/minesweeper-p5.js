document.addEventListener('contextmenu', (event) => event.preventDefault());

function make2DArray(cols, rows) {
	const arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

let grid;
let cols, rows;
const w = 40;
let size = 400;
const totalBombs = size/25;
let isGameOver = false;
let win = false;
let topSpace = 0;


function setup() {
	createCanvas(size, size+topSpace);
	cols = Math.floor(width / w);
	rows = Math.floor((height - topSpace) / w);
	grid = make2DArray(cols, rows);

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = new Cell(i, j, w);
		}
	}

	let options = [];
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			options.push([i, j]);
		}
	}

	for (let i = 0; i < totalBombs; i++) {
		const index = floor(random(options.length));
		const choice = options[index];
		const i = choice[0];
		const j = choice[1];
		options.splice(index, 1);
		grid[i][j].bomb = true;
	}

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].countBombs();
		}
	}
}

function draw() {
	background(200);
	for (let i = 0; i < width / w; i++) {
		stroke(100);
		strokeWeight(2)
		line(i * w, topSpace, i * w, height);
		line(0, i * w + topSpace, width, i * w + topSpace);
	}
	grid.forEach((row) => row.forEach((cell) => cell.show()));
}

function gameOver() {
	isGameOver = true;
	grid.forEach((row) =>
		row.forEach((cell) => {
			if (cell.bomb) {
				cell.revealed = true;
			}
			cell.fixed = true;
		})
	);
}

function gameWin() {
	let clearCnt = 0;
	grid.forEach((row) =>
		row.forEach((cell) => {
			if (cell.solved) {
				clearCnt++;
			}
		})
	);
	if (totalBombs === clearCnt) {
		console.log('win');
		win = true;
		gameOver();
	}
}

function mousePressed() {
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			if (grid[i][j].contains(mouseX, mouseY)) {
				if (mouseButton === RIGHT) {
					grid[i][j].check();
					gameWin();
				}
				if (mouseButton === LEFT) {
					grid[i][j].reveal();

					if (grid[i][j].bomb) {
						gameOver();
					}
				}
			}
		}
	}
}
