class Cell {
	constructor(i, j, w) {
		this.bomb = false;
		this.i = i;
		this.j = j;
		this.revealed = false;
		this.x = i * w;
		this.y = j * w;
		this.w = w;
		this.neighborCount = 0;
		this.checked = false;
		this.solved = false;
		this.fixed = false;
		this.last = false;
	}

	drawCheckedFlag() {
		stroke(0);
		fill(255, 0, 0);
		triangle(this.x + w * 0.2, this.y + w * 0.35, this.x + w * 0.5, this.y + w * 0.2, this.x + w * 0.5, this.y + w * 0.5);
		stroke(0);
		strokeWeight(2);
		line(this.x + w * 0.5, this.y + w * 0.2, this.x + w * 0.5, this.y + w * 0.8);
		strokeWeight(4);
		line(this.x + w * 0.3, this.y + w * 0.8, this.x + w * 0.7, this.y + w * 0.8);
		strokeWeight(1);
	}
	drawRedX() {
		stroke(255, 0, 0);
		strokeWeight(2);
		line(this.x, this.y, this.x + w, this.y + w);
		line(this.x + w, this.y, this.x, this.y + w);
		strokeWeight(1);
	}

	drawCellBackground(color) {
		fill(color);
		stroke(0);
		rect(this.x, this.y, this.w, this.w);
	}

	drawNeighborCount() {
		textAlign(CENTER);
		textStyle(BOLD);
		noStroke();
		switch (this.neighborCount) {
			case 1:
				fill('blue');
				break;
			case 2:
				fill('green');
				break;
			case 3:
				fill('red');
				break;
			case 4:
				fill('purple');
				break;
			default:
				fill(0);
				break;
		}
		textSize(26);
		text(this.neighborCount, this.x + this.w / 2, this.y + this.w / 2 + 8);
	}
	drawBomb() {
		stroke(0);
		strokeWeight(2);
		line(this.x + this.w / 2, this.y + this.w * 0.8, this.x + this.w / 2, this.y + this.w * 0.2);
		line(this.x + this.w *0.8, this.y + this.w /2, this.x + this.w *0.2, this.y + this.w /2);
		line(this.x + this.w*0.28, this.y+ this.w*0.28, this.x + w*0.72, this.y + w*0.72);
		line(this.x + this.w*0.28, this.y + w*0.72, this.x + w*0.72, this.y+ this.w*0.28);
		strokeWeight(1);
		noStroke();
		fill(0);
		ellipse(this.x + this.w / 2, this.y + this.w / 2, this.w / 2);
		fill(255);
		ellipse(this.x + this.w / 2.5, this.y + this.w / 2.5, this.w / 6);
		
	}

	show() {
		if (this.revealed) {
			this.drawCellBackground(200);
			if (this.checked) {
				this.drawCheckedFlag();
				if (isGameOver && !this.solved) {
					this.drawCheckedFlag();
					this.drawRedX();
				}
			} else if (this.bomb) {
				this.drawBomb();
			} else {
				if (this.neighborCount > 0) {
					this.drawNeighborCount();
				}
			}
		}
		if(isGameOver&&this.last){
			this.drawCellBackground([255,0,0]);
			this.drawBomb()
		}
	}
	contains(x, y) {
		return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w;
	}

	check() {
		if (this.fixed) {
			return;
		}

		this.revealed = !this.revealed;
		this.checked = !this.checked;

		if (this.bomb && this.checked) {
			this.solved = true;
		}
	}

	reveal() {
		if (this.checked || this.fixed) {
			return;
		}
		this.revealed = true;
		this.fixed = true;

		if (this.neighborCount === 0) {
			//flood fill
			this.floodFill();
		}
	}

	floodFill() {
		for (let xOff = -1; xOff <= 1; xOff++) {
			for (let yOff = -1; yOff <= 1; yOff++) {
				let i = this.i + xOff;
				let j = this.j + yOff;
				if (i > -1 && i < cols && j > -1 && j < rows) {
					let neighbor = grid[i][j];
					if (!neighbor.bomb && !neighbor.revealed) {
						neighbor.reveal();
					}
				}
			}
		}
	}

	countBombs() {
		if (this.bomb) {
			this.neighborCount = -1;
			return;
		}
		let total = 0;

		for (let xOff = -1; xOff <= 1; xOff++) {
			for (let yOff = -1; yOff <= 1; yOff++) {
				let i = this.i + xOff;
				let j = this.j + yOff;
				if (i > -1 && i < cols && j > -1 && j < rows) {
					let neighbor = grid[i][j];
					if (neighbor.bomb) {
						total++;
					}
				}
			}
		}

		this.neighborCount = total;
	}
}
