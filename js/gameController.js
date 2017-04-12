//controller
class GameController {
	constructor(_model, _keyInput, _field) {
		this.myModel = _model;
		this.myField = _field;
		this.startkey = _keyInput;
		this.startkey.addEventListener("click", this.go.bind(this));
	}

	go(EO) {
		this.myModel.snakeStart();
		document.addEventListener("keydown", this.keyDown.bind(this), false);
//поддержка жестов для управлении на мобильных устройствах
		let SwipeControll = new Hammer(document);
		SwipeControll.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
		SwipeControll.on("swipeleft", function (EO) {
			EO.preventDefault();
			this.snakeShift(37);
		});
		SwipeControll.on("swiperight", function (EO) {
			EO.preventDefault();
			this.snakeShift(39);
		});
		SwipeControll.on("swipeup", function (EO) {
			EO.preventDefault();
			this.snakeShift(38);
		});
		SwipeControll.on("swipedown", function (EO) {
			EO.preventDefault();
			this.snakeShift(40);
		});
	}

	keyDown(EO) {
		EO = EO || window.event;
		if (EO.keyCode == 37 || EO.keyCode == 38 || EO.keyCode == 39 || EO.keyCode == 40) {
			EO.preventDefault();
			this.snakeShift(EO.keyCode);
		}
	}

	snakeShift(pressedChar) {
		if (pressedChar == 37) {
			this.myModel.snakeShift(-1, 0);
		}
		if (pressedChar == 38) {
			this.myModel.snakeShift(0, -1);
		}
		if (pressedChar == 39) {
			this.myModel.snakeShift(1, 0);
		}
		if (pressedChar == 40) {
			this.myModel.snakeShift(0, 1);
		}
	}
}
