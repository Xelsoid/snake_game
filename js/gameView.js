// view
class GameView {
	constructor() {
		this.myModel;
		this.myField;
		this.maxSnakeLength = null;
		this.snakeA = []; //массивы с ссылками на ДОМ элементы
		this.foodA = [];
		this.horWallA = [];
		this.vertWallA = [];
		this.bricksA = []; 
		this.cellSize = 0;
		this.vWCoeff = 0; //коэффициент ширины экрана
		this.gameScoreField = null;
		this.hScore = null; //поле с очками
		this.wallHorz;
		this.wallVert;
		this.widthOfScene; //ширина поля игры
		window.addEventListener('resize', this.windowResize.bind(this));
	}

	windowResize(myModel) {
		let html = document.documentElement;
		let maxBrowserWidth = html.clientWidth; //% ширина экрана утройства занятая под приложение
		let maxBrowserHeight = html.clientHeight;
		this.vWCoeff = maxBrowserWidth * 80 / 100 / this.widthOfScene;
		this.updateStatic();
		this.updateActive();
	}

	start(Model, Field, _gameScoreField, _hScore) {
		this.myField = Field; //поле сцены
		this.myModel = Model; //модель 
		this.gameScoreField = _gameScoreField;
		this.hScore = _hScore;

		this.maxSnakeLength = this.myModel.snakeCellsC; //к-во ДОМ элементов змеи
		this.cellSize = this.myModel.cellSize; //к-во ДОМ элементов Кирпичей
		this.wallHorz = this.myModel.horzWallCells;
		this.wallVert = this.myModel.vertWallCells;
		this.widthOfScene = this.myModel.widthOfScene
		this.createDOMTree();
		this.windowResize();
	}

	createDOMTree() {
		for (let i = 0; i < this.maxSnakeLength; i++) // создаем ДОМ змейку, не отображаем пока!
		{
			let newDOMCell = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
			this.snakeA[i] = newDOMCell;
			newDOMCell.setAttribute('id', 'SN' + i);
			newDOMCell.setAttribute('stroke', 'red');
			newDOMCell.setAttribute('fill', 'blue');
			this.myField.appendChild(newDOMCell);
		}
		for (let i = 0; i < this.myModel.bricksA.length; i++) //строим ДОМ кирпичики  не отображаем!
		{
			let newDOMCell = document.createElementNS("http://www.w3.org/2000/svg", 'image');
			this.bricksA[i] = newDOMCell;
			newDOMCell.setAttributeNS("http://www.w3.org/1999/xlink", "href", "img/BrownBrick.png");
			newDOMCell.setAttribute('id', 'BR' + i);
			this.myField.appendChild(newDOMCell);
		}
		for (let i = 0; i < this.myModel.horzWallA.length; i++) //строим ДОМ горизонтальную стену не отображаем!
		{
			let newDOMCell = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
			this.horWallA[i] = newDOMCell;
			newDOMCell.setAttribute('id', 'HW' + i);
			newDOMCell.setAttribute('stroke', 'brown');
			newDOMCell.setAttribute('fill', 'brown');
			this.myField.appendChild(newDOMCell);
		}
		for (let i = 0; i < this.myModel.vertWallA.length; i++) //строим ДОМ горизонтальную стену не отображаем!
		{
			let newDOMCell = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
			this.vertWallA[i] = newDOMCell;
			newDOMCell.setAttribute('id', 'VW' + i);
			newDOMCell.setAttribute('stroke', 'brown');
			newDOMCell.setAttribute('fill', 'brown');
			this.myField.appendChild(newDOMCell);
		}
		for (let i = 0; i < this.myModel.foodA.length; i++) //строим ДОМ еды не отображаем!
		{
			let newDOMCell = document.createElementNS("http://www.w3.org/2000/svg", 'image');
			newDOMCell.setAttributeNS("http://www.w3.org/1999/xlink", "href", "img/apple.png");
			this.foodA[i] = newDOMCell;
			newDOMCell.setAttribute('id', 'FD' + i);
			this.myField.appendChild(newDOMCell);
		}
	}

	updateStatic() {
		this.myField.setAttribute('width', this.myModel.widthOfScene * this.vWCoeff + 'px');
		this.myField.setAttribute('height', this.myModel.heightOfScene * this.vWCoeff + 'px');

		for (let i = 0; i < this.myModel.bricksA.length; i++) //ДОМ кирпичики отображаем!
		{
			let modelCoordX = this.myModel.bricksA[i][0].Cx; //нужен только нулевой массив т.к. картинка в 4 раза больше ячейки
			let modelCoordY = this.myModel.bricksA[i][0].Cy;
			let DOMCell = this.bricksA[i];
			DOMCell.setAttribute('x', modelCoordX * this.vWCoeff + 'px');
			DOMCell.setAttribute('y', modelCoordY * this.vWCoeff + 'px');
			DOMCell.setAttribute('width', this.cellSize * 2 * this.vWCoeff + 'px');
			DOMCell.setAttribute('height', this.cellSize * 2 * this.vWCoeff + 'px');
		}
		for (let i = 0; i < this.myModel.horzWallA.length; i++) //ДОМ горизонтальную стену отображаем!
		{
			let modelCoordX = this.myModel.horzWallA[i][0].Cx;
			let modelCoordY = this.myModel.horzWallA[i][0].Cy;
			let DOMCell = this.horWallA[i];
			DOMCell.setAttribute('x', modelCoordX * this.vWCoeff + 'px');
			DOMCell.setAttribute('y', modelCoordY * this.vWCoeff + 'px');
			DOMCell.setAttribute('width', this.wallHorz * this.cellSize * this.vWCoeff + 'px');
			DOMCell.setAttribute('height', this.cellSize * this.vWCoeff + 'px');
		}
		for (let i = 0; i < this.myModel.vertWallA.length; i++) //ДОМ вертикальную стену отображаем!
		{
			let modelCoordX = this.myModel.vertWallA[i][0].Cx;
			let modelCoordY = this.myModel.vertWallA[i][0].Cy;
			let DOMCell = this.vertWallA[i];
			DOMCell.setAttribute('x', modelCoordX * this.vWCoeff + 'px');
			DOMCell.setAttribute('y', modelCoordY * this.vWCoeff + 'px');
			DOMCell.setAttribute('width', this.cellSize * this.vWCoeff + 'px');
			DOMCell.setAttribute('height', this.wallVert * this.cellSize * this.vWCoeff + 'px');
		}
	}

	updateActive() {
		for (let i = 0; i < this.maxSnakeLength; i++) //отображаем змейку
		{
			if (!this.myModel.snakeBodyA[i]) {
				break;
			}
			let modelCoordX = this.myModel.snakeBodyA[i].Cx;
			let modelCoordY = this.myModel.snakeBodyA[i].Cy;
			let DOMCell = this.snakeA[i];
			DOMCell.setAttribute('x', modelCoordX * this.vWCoeff + 'px');
			DOMCell.setAttribute('y', modelCoordY * this.vWCoeff + 'px');
			DOMCell.setAttribute('width', this.cellSize * this.vWCoeff + 'px');
			DOMCell.setAttribute('height', this.cellSize * this.vWCoeff + 'px');
		}

		for (let i = 0; i < this.myModel.foodA.length; i++) //отображаем еду
		{
			let DOMCell = this.foodA[i];
			let modelCoordX = this.myModel.foodA[0].Cx;
			let modelCoordY = this.myModel.foodA[0].Cy;
			DOMCell.setAttribute('stroke', 'black');
			DOMCell.setAttribute('fill', 'green');
			DOMCell.setAttribute('x', modelCoordX * this.vWCoeff + 'px');
			DOMCell.setAttribute('y', modelCoordY * this.vWCoeff + 'px');
			DOMCell.setAttribute('width', this.cellSize * this.vWCoeff + 'px');
			DOMCell.setAttribute('height', this.cellSize * this.vWCoeff + 'px');
		}

		let DOMCell = this.snakeA[this.myModel.snakeBodyA.length-1];
		DOMCell.setAttribute('fill', 'black');
		DOMCell = this.snakeA[this.myModel.snakeBodyA.length-2];
		DOMCell.setAttribute('fill', 'blue');
	}
	updateScore(Score) {
		this.gameScoreField.innerHTML = 'Score: ' + Score;
	}
	unHideScoreList(_gameScore) {
		this.hScore.style.display = 'block'
	}
}
