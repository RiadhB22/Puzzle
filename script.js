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
  size = 4;
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
  do {
    shuffle(indexes);
  } while (isSolved(indexes)); // garantir que ce n’est pas déjà résolu

  indexes.forEach((idx, i) => {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    const row = Math.floor(idx / size);
    const col = idx % size;
    piece.style.backgroundImage = `url(${imageSrc})`;
    piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
    piece.dataset.index = idx;
    piece.addEventListener("click", () => handleClick(i));
    pieces.push(piece);
    puzzleBoard.appendChild(piece);
  });

  timer = setInterval(updateTimer, 1000);
}

function handleClick(i) {
  clickSound.play();
  const empty = pieces.findIndex(p => !p.textContent && !p.hasChildNodes());
  if (i === empty) return;

  swapSound.play();

  const a = pieces[i];
  const b = pieces[empty];

  [a.style.backgroundPosition, b.style.backgroundPosition] = [b.style.backgroundPosition, a.style.backgroundPosition];
  [a.dataset.index, b.dataset.index] = [b.dataset.index, a.dataset.index];

  moves++;
  movesSpan.textContent = moves;
  scoreSpan.textContent = (size * size * 2 - moves).toString();

  if (checkWin()) {
    clearInterval(timer);
    winSound.play();
    message.classList.remove("hidden");
  }
}

function checkWin() {
  return Array.from(puzzleBoard.children).every((piece, idx) =>
    parseInt(piece.dataset.index) === idx
  );
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
  return array.every((v, i) => v === i);
}
