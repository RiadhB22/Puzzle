const startBtn = document.getElementById("start-btn");
const nameInput = document.getElementById("player-name");
const displayName = document.getElementById("display-name");
const startScreen = document.getElementById("start-screen");
const gameUI = document.getElementById("game-ui");
const puzzleBoard = document.getElementById("puzzle-board");
const message = document.getElementById("message");
const replayBtn = document.getElementById("replay-btn");
const nextBtn = document.getElementById("next-btn");
const scoreSpan = document.getElementById("score");
const movesSpan = document.getElementById("moves");
const timerSpan = document.getElementById("timer");

const imageSrc = "files/cat.jpg";
const clickSound = new Audio("files/click.mp3");
const swapSound = new Audio("files/swap.mp3");
const winSound = new Audio("files/win.mp3");

let size = 3;
let pieces = [];
let emptyIndex = -1;
let moves = 0;
let timer;
let seconds = 0;

startBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (name) {
    displayName.textContent = name;
    startScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");
    startGame();
  }
});

replayBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", () => {
  size = 4; // Niveau 2 : puzzle 4x4
  startGame();
});

function startGame() {
  clearInterval(timer);
  message.classList.add("hidden");
  puzzleBoard.innerHTML = "";
  puzzleBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  pieces = [];
  moves = 0;
  seconds = 0;
  movesSpan.textContent = "0";
  scoreSpan.textContent = "0";
  timerSpan.textContent = "00:00";

  const indexes = Array.from({ length: size * size }, (_, i) => i);
  shuffle(indexes);

  while (isSolved(indexes)) {
    shuffle(indexes);
  }

  for (let i = 0; i < size * size; i++) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    const row = Math.floor(indexes[i] / size);
    const col = indexes[i] % size;
    piece.style.backgroundImage = `url(${imageSrc})`;
    piece.style.backgroundSize = `${size * 100}px ${size * 100}px`;
    piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
    piece.dataset.index = indexes[i];
    piece.addEventListener("click", () => onPieceClick(i));
    pieces.push(piece);
    puzzleBoard.appendChild(piece);
  }

  timer = setInterval(updateTimer, 1000);
}

function onPieceClick(i) {
  clickSound.play();
  if (pieces.length < 2) return;
  if (i === emptyIndex) return;

  if (!pieces[i].classList.contains("empty")) {
    swapSound.play();
    const index1 = pieces[i].dataset.index;
    const index2 = pieces[emptyIndex]?.dataset.index;

    // Swap visuel
    const temp = pieces[i].style.backgroundPosition;
    pieces[i].style.backgroundPosition = pieces[emptyIndex]?.style.backgroundPosition;
    pieces[emptyIndex].style.backgroundPosition = temp;

    // Swap data
    const tempIndex = pieces[i].dataset.index;
    pieces[i].dataset.index = pieces[emptyIndex].dataset.index;
    pieces[emptyIndex].dataset.index = tempIndex;

    moves++;
    movesSpan.textContent = moves;
    scoreSpan.textContent = (size * size * 2 - moves).toString();

    if (checkWin()) {
      clearInterval(timer);
      message.classList.remove("hidden");
      winSound.play();
    }
  }
}

function checkWin() {
  return Array.from(puzzleBoard.children).every((piece, index) => {
    return parseInt(piece.dataset.index) === index;
  });
}

function updateTimer() {
  seconds++;
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  timerSpan.textContent = `${min}:${sec}`;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function isSolved(array) {
  return array.every((val, i) => val === i);
}
