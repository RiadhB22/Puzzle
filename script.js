const startBtn = document.getElementById("start-btn");
const gameUI = document.getElementById("game-ui");
const startScreen = document.getElementById("start-screen");
const playerNameInput = document.getElementById("player-name");
const playerDisplay = document.getElementById("player-display");
const puzzle = document.getElementById("puzzle");
const winMessage = document.getElementById("win-message");
const scoreDisplay = document.getElementById("score");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const replayBtn = document.getElementById("replay-btn");

let tiles = [];
let moves = 0;
let score = 0;
let timer, seconds = 0;

const clickSound = new Audio("files/click.mp3");
const swapSound = new Audio("files/swap.mp3");
const winSound = new Audio("files/win.mp3");

function updateTimer() {
  seconds++;
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${min}:${sec}`;
}

function shuffleArray(array) {
  let shuffled = array.slice();
  do {
    shuffled.sort(() => Math.random() - 0.5);
  } while (shuffled.some((val, i) => val === i));
  return shuffled;
}

function createPuzzle() {
  puzzle.innerHTML = "";
  const positions = shuffleArray([...Array(9).keys()]);
  tiles = [];
  positions.forEach((pos, index) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.style.backgroundImage = "url('files/cat.jpg')";
    tile.style.backgroundPosition = `-${(pos % 3) * 100}px -${Math.floor(pos / 3) * 100}px`;
    tile.dataset.correct = pos;
    tile.dataset.current = index;
    tile.addEventListener("click", () => handleClick(tile));
    puzzle.appendChild(tile);
    tiles.push(tile);
  });
}

let firstTile = null;

function handleClick(tile) {
  clickSound.play();
  if (!firstTile) {
    firstTile = tile;
    tile.style.border = "2px solid red";
  } else if (tile !== firstTile) {
    swapSound.play();
    const index1 = Array.from(puzzle.children).indexOf(firstTile);
    const index2 = Array.from(puzzle.children).indexOf(tile);

    puzzle.insertBefore(tile, firstTile);
    puzzle.insertBefore(firstTile, puzzle.children[index2]);

    firstTile.style.border = "1px solid #ccc";
    firstTile = null;

    moves++;
    movesDisplay.textContent = moves;
    checkWin();
  }
}

function checkWin() {
  const currentOrder = Array.from(puzzle.children).map(tile => parseInt(tile.dataset.correct));
  const isWin = currentOrder.every((val, idx) => val === idx);
  if (isWin) {
    clearInterval(timer);
    winSound.play();
    score = 100 - moves;
    scoreDisplay.textContent = score;
    winMessage.classList.remove("hidden");
  }
}

startBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (!name) {
    alert("Entrez votre nom.");
    return;
  }
  playerDisplay.textContent = name;
  startScreen.style.display = "none";
  gameUI.style.display = "block";
  moves = 0;
  score = 0;
  seconds = 0;
  movesDisplay.textContent = moves;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = "00:00";
  winMessage.classList.add("hidden");
  createPuzzle();
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
});

replayBtn.addEventListener("click", () => {
  moves = 0;
  score = 0;
  seconds = 0;
  movesDisplay.textContent = moves;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = "00:00";
  winMessage.classList.add("hidden");
  createPuzzle();
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
});
