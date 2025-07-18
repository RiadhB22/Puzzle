const puzzleContainer = document.getElementById("puzzle-container");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const playerNameInput = document.getElementById("player-name");
const displayName = document.getElementById("display-name");
const startButton = document.getElementById("start-button");
const winMessage = document.getElementById("win-message");
const buttons = document.getElementById("buttons");
const scoreEl = document.getElementById("score");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");

const clickSound = new Audio("files/click.mp3");
const swapSound = new Audio("files/swap.mp3");
const winSound = new Audio("files/win.mp3");

let pieces = [];
let firstPiece = null;
let moves = 0;
let score = 0;
let timer = 0;
let interval;

startButton.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (name !== "") {
    displayName.textContent = name;
    startScreen.style.display = "none";
    gameContainer.classList.remove("hidden");
    startGame();
  }
});

function startGame() {
  pieces = [];
  puzzleContainer.innerHTML = "";
  winMessage.classList.add("hidden");
  buttons.classList.add("hidden");
  moves = 0;
  score = 0;
  timer = 0;
  updateHUD();

  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    updateTimer();
  }, 1000);

  for (let i = 0; i < 9; i++) {
    pieces.push(i);
  }

  do {
    shuffle(pieces);
  } while (pieces.some((val, idx) => val === idx));

  for (let i = 0; i < 9; i++) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundImage = "url('files/cat.jpg')";
    const row = Math.floor(pieces[i] / 3);
    const col = pieces[i] % 3;
    piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
    piece.dataset.index = i;
    piece.dataset.correct = pieces[i];
    piece.addEventListener("click", () => handlePieceClick(piece));
    puzzleContainer.appendChild(piece);
  }
}

function handlePieceClick(piece) {
  clickSound.play();
  if (!firstPiece) {
    firstPiece = piece;
    piece.style.border = "2px solid blue";
  } else if (firstPiece !== piece) {
    swapPieces(firstPiece, piece);
    firstPiece.style.border = "1px solid #ccc";
    firstPiece = null;
  }
}

function swapPieces(p1, p2) {
  swapSound.play();
  const i1 = p1.dataset.index;
  const i2 = p2.dataset.index;

  [p1.dataset.correct, p2.dataset.correct] = [p2.dataset.correct, p1.dataset.correct];

  const row1 = Math.floor(p1.dataset.correct / 3);
  const col1 = p1.dataset.correct % 3;
  p1.style.backgroundPosition = `-${col1 * 100}px -${row1 * 100}px`;

  const row2 = Math.floor(p2.dataset.correct / 3);
  const col2 = p2.dataset.correct % 3;
  p2.style.backgroundPosition = `-${col2 * 100}px -${row2 * 100}px`;

  moves++;
  updateHUD();

  checkWin();
}

function checkWin() {
  const allCorrect = [...puzzleContainer.children].every(
    (piece, i) => parseInt(piece.dataset.correct) === i
  );

  if (allCorrect) {
    clearInterval(interval);
    winSound.play();
    score = 100 - moves * 2 + Math.max(0, 60 - timer);
    updateHUD();
    winMessage.classList.remove("hidden");
    buttons.classList.remove("hidden");
  }
}

function updateHUD() {
  scoreEl.textContent = score;
  movesEl.textContent = moves;
}

function updateTimer() {
  const min = String(Math.floor(timer / 60)).padStart(2, "0");
  const sec = String(timer % 60).padStart(2, "0");
  timerEl.textContent = `${min}:${sec}`;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function restartGame() {
  startGame();
}

function nextLevel() {
  alert("Niveau 2 bientôt !");
}
