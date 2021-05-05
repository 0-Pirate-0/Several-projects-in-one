// Intro
// DOM Elements for Intro
const intro = document.getElementById('intro'),
	introBtn = document.getElementById('introBtn'),
	time = document.getElementById('time'),
	greeting = document.getElementById('greeting'),
	nameIntro = document.getElementById('name'),
	focusIntro = document.getElementById('focus');

// Options
let showAmPm = false

function switchBtn() {
	if (localStorage.getItem('showAmPm') === 'true') {
		localStorage.setItem('showAmPm', false)
	} else {
		localStorage.setItem('showAmPm', true)
	}
}
// Show Time
function showTime() {
	let today = new Date(),
		hour = today.getHours(),
		min = today.getMinutes(),
		sec = today.getSeconds();

	// Set AM or PM
	const amPm = hour >= 12 ? 'PM' : 'AM'

	// Output Time
	if (localStorage.getItem('showAmPm') === 'true') {
		// 12hr Format
		hour = hour % 12 || 12
		time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)} ${amPm}`
	} else {
		// 24hr Format
		time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`
	}

	setTimeout(showTime, 1000)
}

//Add Zero
function addZero(n) {
	return (parseInt(n, 10) < 10 ? '0' : '') + n
}

// Set Background and Greeting
function setBgGreet() {
	let today = new Date(),
		hour = today.getHours();

	if (hour < 12) {
		// Morning
		intro.style.backgroundImage = "url('assets/images/morning.jpg')"
		greeting.textContent = 'Good Morning,'
	} else if (hour < 18) {
		// Afternoon
		intro.style.backgroundImage = "url('assets/images/afternoon.jpg')"
		greeting.textContent = 'Good Afternoon,'
	} else {
		// Evening
		intro.style.backgroundImage = "url('assets/images/night.jpg')"
		greeting.textContent = 'Good Evening,'
	}
}

// Get Name
function getName() {
	if (localStorage.getItem('nameIntro') === null || localStorage.getItem('nameIntro') === '') {
		nameIntro.textContent = '[Enter Name]'
	} else {
		nameIntro.textContent = localStorage.getItem('nameIntro')
	}
}

// Set Name
function setName(e) {
	if (e.type === 'keypress') {
		// Make sure enter is pressed
		if (e.which == 13 || e.keyCode == 13) {
			localStorage.setItem('nameIntro', e.target.innerText)
			nameIntro.blur()
			getName()
		}
	} else {
		localStorage.setItem('nameIntro', e.target.innerText)
	}
}

// Clear Name
function clearName(e) {
	setTimeout(function () {
		if (e.target.innerText == '[Enter Name]')
			e.target.innerText = ''

	}, 150)
}

// Get Focus
function getFocus() {
	if (localStorage.getItem('focusIntro') === null || localStorage.getItem('focusIntro') === '') {
		focusIntro.textContent = '[Enter Focus]';
	} else {
		focusIntro.textContent = localStorage.getItem('focusIntro');
	}
}

// Set Focus
function setFocus(e) {
	if (e.type === 'keypress') {
		// Make sure enter is pressed
		if (e.which == 13 || e.keyCode == 13) {
			localStorage.setItem('focusIntro', e.target.innerText);
			focusIntro.blur();
			getFocus()
		}
	} else {
		localStorage.setItem('focusIntro', e.target.innerText);
	}
}

// Clear Focus
function clearFocus(e) {
	setTimeout(function () {
		if (e.target.innerText == '[Enter Focus]')
			e.target.innerText = ''

	}, 150)
}

// Events
introBtn.addEventListener('click', switchBtn)
nameIntro.addEventListener('click', clearName)
nameIntro.addEventListener('keypress', setName)
nameIntro.addEventListener('blur', setName)
focusIntro.addEventListener('click', clearFocus)
focusIntro.addEventListener('keypress', setFocus)
focusIntro.addEventListener('blur', setFocus)

// Run
showTime()
setBgGreet()
getName()
getFocus()

// Tic Tac Toe
var origBoard;
const huPlayer = 'X';
const aiPlayer = 'O';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.tictac__cell');
startGame();

function startGame() {
	document.querySelector(".tictac__endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {
				index: index,
				player: player
			};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "rgba(173, 29, 27, 0.7)";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!");
}

function declareWinner(who) {
	document.querySelector(".tictac__endgame").style.display = "block";
	document.querySelector(".tictac__endgame .tictac__text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "rgba(35, 131, 15, 0.7)";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {
			score: -10
		};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {
			score: 10
		};
	} else if (availSpots.length === 0) {
		return {
			score: 0
		};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if (player === aiPlayer) {
		var bestScore = -10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}

// Rock Paper and Scissors
const gameRps = () => {
	let pScore = 0
	let cScore = 0

	// Start the game
	const startGame = () => {
		const playBtn = document.querySelector('.rps__name button')
		const rpsScreen = document.querySelector('.rps__name')
		const match = document.querySelector('.rps__match')

		playBtn.addEventListener('click', () => {
			rpsScreen.classList.add('fadeOut')
			match.classList.add('fadeIn')
		})
	}

	// Play Match
	const playMatch = () => {
		const options = document.querySelectorAll('.rps__options button')
		const playerHand = document.querySelector('.rps__player--hand')
		const computerHand = document.querySelector('.rps__computer--hand')
		const hands = document.querySelectorAll('.rps__hands img')

		if(screen.width <= 730) {
			playerHand.src = `assets/images/rock-2.png`
			computerHand.src = `assets/images/rock-2.png`
		}

		hands.forEach(hand => {
			hand.addEventListener('animationend', function() {
				this.style.animation = ''
			})
		})
		// Computer Options
		const computerOptions = ['rock', 'paper', 'scissors']
		options.forEach((option) => {
			option.addEventListener('click', function() {
				// Switch Fz
				const winner = document.querySelector('.rps__winner')
				const winnerFz = () => {
					if(screen.width <= 500 && winner.textContent === 'Wait a few seconds...') {
						winner.style.fontSize = '40px'
					} else if(screen.width <= 500 && winner.textContent !== 'Wait a few seconds...') {
						winner.style.fontSize = '48px'
					}
					if(screen.width <= 420 && winner.textContent === 'Wait a few seconds...') {
						winner.style.fontSize = '36px'
					} else if(screen.width <= 420 && winner.textContent !== 'Wait a few seconds...') {
						winner.style.fontSize = '48px'
					}
					if(screen.width <= 380 && winner.textContent === 'Wait a few seconds...') {
						winner.style.fontSize = '32px'
					} else if(screen.width <= 380 && winner.textContent !== 'Wait a few seconds...') {
						winner.style.fontSize = '44px'
					}
					if(screen.width <= 345 && winner.textContent === 'Wait a few seconds...') {
						winner.style.fontSize = '28px'
					} else if(screen.width <= 345 && winner.textContent !== 'Wait a few seconds...') {
						winner.style.fontSize = '40px'
					}
				} 

				// Computer Choise
				const computerNumber = Math.floor(Math.random() * 3)
				const computerChoise = computerOptions[computerNumber]
				if(winner.textContent === 'Choose an option' || winner.textContent !== 'Choose an option') {
					winner.textContent = 'Wait a few seconds...'
					winnerFz()
				}			

				if(screen.width <= 730) {
					playerHand.src = `assets/images/rock-2.png`
					computerHand.src = `assets/images/rock-2.png`
					setTimeout(() => {
						// Here is where we call compare hands
						compareHands(this.textContent, computerChoise)
						// Swith Font size
						winnerFz()
						// Update Images
						playerHand.src = `assets/images/${this.textContent}-2.png`
						computerHand.src = `assets/images/${computerChoise}-2.png`
					}, 1950)
				} else {
					playerHand.src = `assets/images/rock.png`
					computerHand.src = `assets/images/rock.png`
					setTimeout(() => {
						// Here is where we call compare hands
						compareHands(this.textContent, computerChoise)
						// Swith Font size
						winnerFz()
						// Update Images
						playerHand.src = `assets/images/${this.textContent}.png`
						computerHand.src = `assets/images/${computerChoise}.png`
					}, 1950)
				}	
				
				// Animation
				playerHand.style.animation = 'shakePlayer 2s ease'
				computerHand.style.animation = 'shakeComputer 2s ease'
			})
		})
	}

	// Update Score
	const updateScore = () => {
		const playerScore = document.querySelector('#rps__player--score p')
		const computerScore = document.querySelector('#rps__computer--score p')
		playerScore.textContent = pScore
		computerScore.textContent = cScore
	}

	// Calculates the Winner
	const compareHands = (playerChoise, computerChoise) => {
		// Update Text
		const winner = document.querySelector('.rps__winner')
		// Checking for a tie
		if(playerChoise === computerChoise) {
			winner.textContent = 'It is a tie'
			return
		}
		// Check for rock
		if(playerChoise === 'rock') {
			if(computerChoise === 'scissors') {
				winner.textContent = 'Player Wins'
				pScore++
				updateScore()
				return
			} else {
				winner.textContent = 'Computer Wins'
				cScore++
				updateScore()
				return
			}
		}
		// Check for paper
		if(playerChoise === 'paper') {
			if(computerChoise === 'rock') {
				winner.textContent = 'Player Wins'
				pScore++
				updateScore()
				return
			} else {
				winner.textContent = 'Computer Wins'
				cScore++
				updateScore()
				return
			}
		}
		// Check for scissors
		if(playerChoise === 'scissors') {
			if(computerChoise === 'paper') {
				winner.textContent = 'Player Wins'
				pScore++
				updateScore()
				return
			} else {
				winner.textContent = 'Computer Wins'
				cScore++
				updateScore()
				return
			}
		}
	}
	// Run function
	startGame()
	playMatch()
}

// Start the game function
gameRps()

// Snake
const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

const ground = new Image()
ground.src = "assets/images/ground.png"

const foodImg = new Image()
foodImg.src = "assets/images/food.png"

let box = 32
let score = 0

let food = {
    x: Math.floor((Math.random() * 17 + 1)) * box,
    y: Math.floor((Math.random() * 15 + 3)) * box
}

let snake = []
snake[0] = {
    x: 9 * box,
    y: 10 * box
}

document.addEventListener("keydown", direction)
let dir

function direction(event) {
    if(event.keyCode == 37 && dir != "right") {
        dir = "left"
    } else if(event.keyCode == 38 && dir != "down") {
        dir = "up"
    } else if(event.keyCode == 39 && dir != "left") {
        dir = "right"
    } else if(event.keyCode == 40 && dir != "up") {
        dir = "down"
    } 
}

function eatTail(head, arr) {
    for(let i = 0; i < arr.length; i++) {
        if(head.x == arr[i].x && head.y == arr[i].y) {
            clearInterval(gameSnake)
        }
    }
}

function drawGame() {
    ctx.drawImage(ground, 0, 0)
    ctx.drawImage(foodImg, food.x, food.y)

    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "green" : "red"
        ctx.fillRect(snake[i].x, snake[i].y, box, box)
    }

    ctx.fillStyle = "white"
    ctx.font = "45px Arial"
    ctx.fillText(`Счёт: ${score}`, box* 2.5, box * 1.6)

    let snakeX = snake[0].x
    let snakeY = snake[0].y

    if(snakeX == food.x && snakeY == food.y) {
        score++
        food = {
            x: Math.floor((Math.random() * 17 + 1)) * box,
            y: Math.floor((Math.random() * 15 + 3)) * box
        }
    } else {
        snake.pop()
    }

    if(snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17) {
        clearInterval(gameSnake)
    }

    if(dir == "left") snakeX -= box
    if(dir == "right") snakeX += box
    if(dir == "up") snakeY -= box
    if(dir == "down") snakeY += box

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    eatTail(newHead, snake)
    snake.unshift(newHead)
}

let gameSnake = setInterval(drawGame, 105)

// Scrool + Body lock + Swith text
const snakeBtnBodyLock = document.querySelector('.snake__btn')
snakeBtnBodyLock.addEventListener('click', function() {
	// Smooth scrool to gameSnake
	snakeBtnBodyLock.scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	})
	// Switch text on the button
	let text = document.body.classList.contains('overflow') ? "lock" : "unlock"
	snakeBtnBodyLock.textContent = `Tap to ${text} the screen`
	// Body overflow hidden
	document.body.classList.toggle('overflow')
})