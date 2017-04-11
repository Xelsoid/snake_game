let keyInput=document.getElementById('start');
let resetPage=document.getElementById('reset');
keyInput.addEventListener('click', hideStartMenu, false);
resetPage.addEventListener('click', reloadPage, false);
let field=document.getElementById('field');
let gameScore=document.getElementById('gameScore');
let hScores=document.getElementById('hiddenScores');

let Model = new GameModel();
let View = new GameView();
let Controller = new GameController(Model,keyInput,field);

Model.start(View);
View.start(Model, field, gameScore, hScores);

function hideStartMenu(EO){
	console.log('gg');
	let startMenu=document.getElementById('startMenu');
	startMenu.style.display = 'none';
}

function reloadPage(EO){
	location.reload();
}
