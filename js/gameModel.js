//model
class GameModel {
	constructor() {
		this.cellSize = 20; // размер ячейки хода(КОНСТАНТА)
		this.horzBlocks = 50; //количесто блоков по горинзотали, вертикали (НАСТРОЙКА)
		this.vertBlocks = 30;
		this.widthOfScene = 0; //длина ширина СЦЕНЫ
		this.heightOfScene = 0;
		this.X = 0; // идентификатор направления движения
		this.Y = 0;
		this.speed = 20; // скорость, скорость по Х и У (КОНСТАНТА)
		this.speedX = 0;
		this.speedY = 0;
		this.snakeGrown = 0; // индикатор роста змеи
		this.snakeCellsC = 90; // количество "ячеек" змеи (максимальная длина) (НАСТРОЙКА)
		this.snakeBodyA = [{ Cx: 120, Cy: 100 }, { Cx: 140, Cy: 100 }, { Cx: 140, Cy: 120 }, { Cx: 140, Cy: 140 }, { Cx: 160, Cy: 140 }]; // массив с змеёй
		this.snakeHeadNew = {}; // хэш с координатами головы змеи
		this.myView = null; //сцена действия
		this.previousX = 5; //(предыдущее направление движения)любое значение кроме (0,1,-1)для инициализации запуска
		this.previousY = 5;
		this.numberOfBricks = 6; // количество кирпичей (НАСТРОЙКА)
		this.brickHeight = 40; //высота ширина кирпичей
		this.brickWidth = 40;
		this.bricksA = []; // массив с хэшами координат кирпичей
		this.horzWallA = [];
		this.vertWallA = [];
		this.horzWallCells = 0; //что-бы одна стена была примерно треть стороны
		this.vertWallCells = 0;
		this.foodA = [];
		this.gameScore = 0;
		this.timer;
		this.appleMP3 = new Audio('sound/eatingApple.mp3');
		this.moveMP3 = new Audio('sound/snakeMove4.mp3');
		this.changeDirectionMP3 = new Audio('sound/snakeMove3.mp3');
		this.bgsoundMP3 = new Audio('sound/startBG3.mp3');
		this.gameOverMP3 = new Audio('sound/gameOver.mp3');
	}

	start(_viewScene) {//текущий элемент модели
		this.myView = _viewScene;
		this.widthOfScene = this.cellSize * this.horzBlocks;
		this.heightOfScene = this.cellSize * this.vertBlocks;
		this.generateBricks();
		this.generateWalls();
		this.generateFood();
	}

	snakeStart() {
		clearInterval(this.timer);
		this.soundEff('gameBGstart');
		this.timer = setInterval(this.snakeMotion.bind(this), 250);
	}

	snakeShift(_X, _Y, _Z) {//определяем направление движения в зависимости от нажатой клавиши
		this.X = _X; // что бы не привязывать значение скорости к контроллеру
		this.Y = _Y;

		if (this.previousX != this.X && this.previousY == this.Y || this.previousX == this.X && this.previousY != this.Y) {
			return;
		}
		this.speedX = this.X * this.speed;
		this.speedY = this.Y * this.speed;

		this.previousX = this.X;
		this.previousY = this.Y;
		this.soundEff('changeDirection');
	}

	snakeMotion() {// движок змеи
		let snakeCellCoordX = 0; //координаты головы змеи
		let snakeCellCoordY = 0;

		if (this.speedX == 0 && this.speedY == 0) //змея не ползет пока скорость не станет не равной нулю
			{
				return;
			}
		snakeCellCoordX = this.snakeBodyA[this.snakeBodyA.length - 1].Cx;
		snakeCellCoordY = this.snakeBodyA[this.snakeBodyA.length - 1].Cy;

		snakeCellCoordX += this.speedX;
		snakeCellCoordY += this.speedY;

		if (snakeCellCoordX < 0) {
			snakeCellCoordX = this.widthOfScene - this.cellSize;
		}
		if (snakeCellCoordX >= this.widthOfScene) {
			snakeCellCoordX = 0;
		}

		if (snakeCellCoordY < 0) {
			snakeCellCoordY = this.heightOfScene - this.cellSize;
		}
		if (snakeCellCoordY >= this.heightOfScene) {
			snakeCellCoordY = 0;
		}

		for (let i = 0; i < this.snakeBodyA.length; i++) {
			if (snakeCellCoordX == this.snakeBodyA[i].Cx && snakeCellCoordY == this.snakeBodyA[i].Cy) {
				console.log('snake');
				return this.gameOver();
			} //змея врезалась в себя!!!
		}
		for (let i = 0; i < this.numberOfBricks; i++) {
			for (let n = 0; n < this.bricksA[i].length; n++) {
				if (snakeCellCoordX == this.bricksA[i][n].Cx && snakeCellCoordY == this.bricksA[i][n].Cy) {
					console.log('brick');
					return this.gameOver();
				} //змея врезалась в кирпич!!!
			}
		}
		for (let i = 0; i < this.horzWallA.length; i++) {
			for (let n = 0; n < this.horzWallA[i].length; n++) {
				if (snakeCellCoordX == this.horzWallA[i][n].Cx && snakeCellCoordY == this.horzWallA[i][n].Cy) {
					console.log('hor');
					return this.gameOver();
				} //змея врезалась в горизонтальную стену!!!
			}
		}
		for (let i = 0; i < this.vertWallA.length; i++) {
			for (let n = 0; n < this.vertWallA[i].length; n++) {
				if (snakeCellCoordX == this.vertWallA[i][n].Cx && snakeCellCoordY == this.vertWallA[i][n].Cy) {
					console.log('vert');
					return this.gameOver();
				} //змея врезалась в вертикальную стену!!!
			}
		}

		this.snakeHeadNew = { Cx: snakeCellCoordX, Cy: snakeCellCoordY };
		this.snakeBodyA.push(this.snakeHeadNew);

		for (let i = 0; i < this.foodA.length; i++) //проверяем "съела ли змея еду"
		{
			if (snakeCellCoordX == this.foodA[i].Cx && snakeCellCoordY == this.foodA[i].Cy) {
				this.snakeGrown = 1;
				this.foodA = [];
				this.generateFood();
				this.gameScore++;
				this.myView.updateScore(this.gameScore);
				this.soundEff('eatApple');
				// this.vibroEff(1);
			}
		}
		if (this.snakeGrown == 0) //Если змея растет, то хвост не отрезаем.
			{
				this.snakeBodyA.shift();
			}
		this.snakeGrown = 0;
		this.soundEff('snakeMotion');
		this.myView.updateActive();
	}

	generateBricks() {
		outer: for (let n = 0; n < this.numberOfBricks; n++) {//расчет координат кирпичей
			let brickCoordX = this.randomDiap(2, this.horzBlocks - 4) * this.cellSize; // координаты кирпичиков 
			let brickCoordY = this.randomDiap(2, this.vertBlocks - 4) * this.cellSize;

			for (let i = 0; i < this.snakeBodyA.length; i++) //не попали ли они на змейку
			{
				if (brickCoordX == this.snakeBodyA[i].Cx && brickCoordY == this.snakeBodyA[i].Cy || brickCoordX + this.cellSize == this.snakeBodyA[i].Cx && brickCoordY == this.snakeBodyA[i].Cy || brickCoordX == this.snakeBodyA[i].Cx && brickCoordY + this.cellSize == this.snakeBodyA[i].Cy || brickCoordX + this.cellSize == this.snakeBodyA[i].Cx && brickCoordY + this.cellSize == this.snakeBodyA[i].Cy) {
					n--;
					continue outer;
				}
			}

			let brick = [{ Cx: brickCoordX, Cy: brickCoordY }, { Cx: brickCoordX + this.cellSize, Cy: brickCoordY }, { Cx: brickCoordX, Cy: brickCoordY + this.cellSize }, { Cx: brickCoordX + this.cellSize, Cy: brickCoordY + this.cellSize }];
			for (let x = 0; x < brick.length; x++) {
				//				console.log('ok');
				for (let z = 0; z < this.bricksA.length; z++) {
					for (let y = 0; y < this.bricksA[z].length; y++) {
						if (brick[x].Cx == this.bricksA[z][y].Cx && brick[x].Cy == this.bricksA[z][y].Cy) {
							n--;
							continue outer;
						}
					}
				}
			}
			this.bricksA.push(brick);
		}
	}

	generateWalls() {// рассчитываем массив координат со стеной
		this.horzWallCells = Math.floor(this.horzBlocks / 3); //что-бы одна стена была примерно треть стороны
		this.vertWallCells = Math.floor(this.vertBlocks / 3);
		let wallCoordX = 0;
		let wallCoordX2 = 0;
		let wallCoordY = 0;
		let wallCoordY2 = 0;
		let wall1 = [];
		let wall2 = [];
		let wall3 = [];
		let wall4 = [];

		for (let i = 0; i < this.horzWallCells; i++) {
			wallCoordX = i * this.cellSize;
			wallCoordY = 0;
			wallCoordY2 = (this.vertBlocks - 1) * this.cellSize;

			wall1[i] = { Cx: wallCoordX, Cy: wallCoordY };
			wall2[i] = { Cx: wallCoordX, Cy: wallCoordY2 };
		}
		for (let i = 0; i < this.horzWallCells; i++) {
			wallCoordX = (this.horzBlocks - this.horzWallCells + i) * this.cellSize;
			wallCoordY = 0;
			wallCoordY2 = (this.vertBlocks - 1) * this.cellSize;

			wall3[i] = { Cx: wallCoordX, Cy: wallCoordY };
			wall4[i] = { Cx: wallCoordX, Cy: wallCoordY2 };
		}
		this.horzWallA.push(wall1);
		this.horzWallA.push(wall2);
		this.horzWallA.push(wall3);
		this.horzWallA.push(wall4);
		wall1 = [];
		wall2 = [];
		wall3 = [];
		wall4 = [];
		for (let i = 0; i < this.vertWallCells; i++) {
			wallCoordX = 0;
			wallCoordY = i * this.cellSize;
			wallCoordX2 = (this.horzBlocks - 1) * this.cellSize;

			wall1[i] = { Cx: wallCoordX, Cy: wallCoordY };
			wall2[i] = { Cx: wallCoordX2, Cy: wallCoordY };
		}
		for (let i = 0; i < this.vertWallCells; i++) {
			wallCoordX = 0;
			wallCoordY = (this.vertBlocks - this.vertWallCells + i) * this.cellSize;
			wallCoordX2 = (this.horzBlocks - 1) * this.cellSize;

			wall3[i] = { Cx: wallCoordX, Cy: wallCoordY };
			wall4[i] = { Cx: wallCoordX2, Cy: wallCoordY };
		}
		this.vertWallA.push(wall1);
		this.vertWallA.push(wall2);
		this.vertWallA.push(wall3);
		this.vertWallA.push(wall4);
	}

	generateFood() {
		let foodCoordX = this.randomDiap(0, this.horzBlocks - 1) * this.cellSize;
		let foodCoordY = this.randomDiap(0, this.vertBlocks - 1) * this.cellSize;

		for (let i = 0; i < this.snakeBodyA.length; i++) {
			if (foodCoordX == this.snakeBodyA[i].Cx && foodCoordY == this.snakeBodyA[i].Cy) {
				return this.generateFood();
			}
		}
		for (let i = 0; i < this.bricksA.length; i++) {
			for (let n = 0; n < this.bricksA[i].length; n++) {
				if (foodCoordX == this.bricksA[i][n].Cx && foodCoordY == this.bricksA[i][n].Cy) {
					return this.generateFood();
				}
			}
		}
		for (let i = 0; i < this.horzWallA.length; i++) {
			for (let n = 0; n < this.horzWallA[i].length; n++) {
				if (foodCoordX == this.horzWallA[i][n].Cx && foodCoordY == this.horzWallA[i][n].Cy) {
					return this.generateFood();
				}
			}
		}
		for (let i = 0; i < this.vertWallA.length; i++) {
			for (let n = 0; n < this.vertWallA[i].length; n++) {
				if (foodCoordX == this.vertWallA[i][n].Cx && foodCoordY == this.vertWallA[i][n].Cy) {
					return this.generateFood();
				}
			}
		}
		this.foodA = [{ Cx: foodCoordX, Cy: foodCoordY }];
	}

	gameOver() {
		// this.vibroEff(2);
		console.log('gameover');
		clearInterval(this.timer);
		this.soundEff('gameBGstop');
		this.soundEff('gameOver');
		this.myView.unHideScoreList(this.gameScore);
	}

	soundEff(flag) {
		switch ( flag ){
			case 'eatApple':
			    this.appleMP3.play();
			    break;
			case 'snakeMotion':
			    this.moveMP3.play();
			    this.moveMP3.volume = 0.3;
			    break;
			case 'changeDirection':
			    this.changeDirectionMP3.play();
			    this.changeDirectionMP3.volume = 0.7;
			    break;  
			case 'gameBGstart':
			    this.bgsoundMP3.loop = true;
			    this.bgsoundMP3.volume = 0.3;
			    this.bgsoundMP3.play();
			    break;
			case 'gameBGstop':
			    this.bgsoundMP3.pause();
			    break;
			case 'gameOver':
			    this.gameOverMP3.play();
			    break; 
		}
		
	}
//поддержка вибро на моб устройствах
	// vibroEff(flag) { // есть поддержка Vibration API?
	// 	switch ( flag ){
	// 		case 1:
	// 		    window.navigator.vibrate(300);
	// 		    break;
	// 		case 2:
	// 		    window.navigator.vibrate(1000);
	// 		    break;
	// 	}
	// }

	randomDiap(N, M) {
		return Math.floor(Math.random() * (M - N + 1)) + N;
	}
}
