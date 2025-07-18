const startBtn = document.getElementById("startButton");
const nameSpan = document.getElementById("name");
const gameUI = document.querySelector(".game-ui");
const startScreen = document.querySelector(".start-screen");
const puzzleContainer = document.getElementById("puzzle-container");
const timerSpan = document.getElementById("timer");
const scoreSpan = document.getElementById("score");
const movesSpan = document.getElementById("moves");
const winMessage = document.getElementById("winMessage");
const nextLevelButton = document.getElementById("nextLevelButton");
const replayButton = document.getElementById("replayButton");

let pieces = [];
let emptyIndex = 0;
let timer, seconds = 0, moves = 0, score = 0;
const size = 3;

const clickSound = new Audio("Puzzle/Files/click.mp3");
const swapSound = new Audio("Puzzle/Files/swap.mp3");
const winSound = new Audio("Puzzle/Files/win.mp3");

startBtn.onclick = () => {
  const name = document.getElementById("playerName").value.trim();
  if (!name) return;
  nameSpan.textContent = name;
  startScreen.classList.add("hidden");
  gameUI.classList.remove("hidden");
  startGame();
};

function startGame() {
  puzzleContainer.innerHTML = "";
  pieces = [];
  moves = 0;
  score = 0;
  seconds = 0;
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
  updateStats();

  for (let i = 0; i < size * size; i++) {
    pieces.push(i);
  }

  do {
    shuffleArray(pieces);
  } while (pieces.some((v, i) => v === i));

  puzzleContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < pieces.length; i++) {
    const piece = document.createElement("img");
    piece.className = "piece";
    piece.dataset.index = i;
    piece.src = `Puzzle/Files/cat.jpg`;
    piece.style.objectPosition = `${-(pieces[i] % size) * 100 / (size - 1)}% ${-Math.floor(pieces[i] / size) * 100 / (size - 1)}%`;
    piece.addEventListener("click", () => handleClick(i));
    puzzleContainer.appendChild(piece);
  }

  winMessage.classList.add("hidden");
  nextLevelButton.disabled = true;
}

function handleClick(index) {
  clickSound.play();

  if (index === emptyIndex) return;

  const i1 = pieces[index];
  const i2 = pieces[emptyIndex];

  [pieces[index], pieces[emptyIndex]] = [pieces[emptyIndex], pieces[index]];
  swapSound.play();
  moves++;
  updateStats();
  renderPieces();

  if (isWin()) {
    clearInterval(timer);
    winMessage.classList.remove("hidden");
    winSound.play();
    nextLevelButton.disabled = false;
  }
}

function renderPieces() {
  const imgs = puzzleContainer.querySelectorAll("img");
  imgs.forEach((img, i) => {
    const val = pieces[i];
    img.style.objectPosition = `${-(val % size) * 100 / (size - 1)}% ${-Math.floor(val / size) * 100 / (size - 1)}%`;
  });
}

function updateStats() {
  movesSpan.textContent = moves;
  scoreSpan.textContent = (100 - moves);
}

function updateTimer() {
  seconds++;
  let min = String(Math.floor(seconds / 60)).padStart(2, "0");
  let sec = String(seconds % 60).padStart(2, "0");
  timerSpan.textContent = `${min}:${sec}`;
}

function isWin() {
  return pieces.every((val, i) => val === i);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

replayButton.onclick = () => startGame();
nextLevelButton.onclick = () => alert("Niveau 2 à venir !");
