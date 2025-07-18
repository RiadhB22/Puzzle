const board = document.getElementById("puzzle-board");
const message = document.getElementById("message");
const scoreSpan = document.getElementById("score");
const movesSpan = document.getElementById("moves");
const timerSpan = document.getElementById("timer");
const playerNameSpan = document.getElementById("player-name");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const nameInput = document.getElementById("player-name-input");

let pieces = [];
let firstPiece = null;
let score = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
const image = "files/cat.jpg";
const size = 3;

const clickSound = new Audio("files/click.mp3");
const swapSound = new Audio("files/swap.mp3");
const winSound = new Audio("files/win.mp3");

function startGame() {
  const name = nameInput.value.trim();
  if (!name) {
    alert("Entrez votre nom !");
    return;
  }
  playerNameSpan.textContent = name;
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  resetGame();
}

function resetGame() {
  board.innerHTML = "";
  pieces = [];
  firstPiece = null;
  score = 0;
  moves = 0;
  timer = 0;
  updateInfo();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
  createPieces();
}

function updateInfo() {
  scoreSpan.textContent = score;
  movesSpan.textContent = moves;
  timerSpan.textContent = formatTime(timer);
}

function updateTimer() {
  timer++;
  timerSpan.textContent = formatTime(timer);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function createPieces() {
  const total = size * size;
  const positions = [...Array(total).keys()];
  let shuffled = [];

  // Shuffle until no piece is in correct position
  do {
    shuffled = positions.slice().sort(() => Math.random() - 0.5);
  } while (shuffled.some((val, idx) => val === idx));

  shuffled.forEach((index, i) => {
    const row = Math.floor(index / size);
    const col = index % size;

    const div = document.createElement("div");
    div.classList.add("piece");
    div.dataset.correct = index;
    div.dataset.current = i;

    const x = (col * 100) / (size - 1);
    const y = (row * 100) / (size - 1);
    div.style.backgroundImage = `url('${image}')`;
    div.style.backgroundPosition = `${x}% ${y}%`;

    div.addEventListener("click", () => handleClick(div));

    pieces.push(div);
    board.appendChild(div);
  });
}

function handleClick(piece) {
  clickSound.play();

  if (!firstPiece) {
    firstPiece = piece;
    piece.classList.add("selected");
    return;
  }

  if (firstPiece === piece) return;

  swapSound.play();
  const idx1 = pieces.indexOf(firstPiece);
  const idx2 = pieces.indexOf(piece);

  board.insertBefore(piece, pieces[idx1]);
  board.insertBefore(firstPiece, pieces[idx2]);

  [pieces[idx1], pieces[idx2]] = [pieces[idx2], pieces[idx1]];

  [firstPiece.dataset.current, piece.dataset.current] = [piece.dataset.current, firstPiece.dataset.current];

  firstPiece.classList.remove("selected");
  firstPiece = null;
  moves++;
  updateInfo();
  checkWin();
}

function checkWin() {
  let correct = 0;
  pieces.forEach((p, i) => {
    if (parseInt(p.dataset.correct) === i) correct++;
  });

  score = correct;
  updateInfo();

  if (correct === size * size) {
    clearInterval(timerInterval);
    winSound.play();
    message.classList.remove("hidden");
  }
}

function goToNextLevel() {
  alert("Prochain niveau (non encore développé)");
}

// Boutons
document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("restart-button").addEventListener("click", resetGame);
document.getElementById("next-level-button").addEventListener("click", goToNextLevel);
