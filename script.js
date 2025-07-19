const playerDisplay = document.getElementById("player-display");
const scoreDisplay = document.getElementById("score");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const puzzleContainer = document.getElementById("puzzle");
const startButton = document.getElementById("start-button");
const nameInput = document.getElementById("player-name");
const gameUI = document.getElementById("game-ui");
const startScreen = document.getElementById("start-screen");
const winMessage = document.getElementById("win-message");
const replayButton = document.getElementById("replay-button");
const nextButton = document.getElementById("next-button");

const clickSound = new Audio("Files/click.mp3");
const swapSound = new Audio("Files/swap.mp3");
const winSound = new Audio("Files/win.mp3");

let positions = [];
let correctPositions = [];
let moves = 0;
let timer = 0;
let timerInterval;

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function shuffle(array) {
  let shuffled;
  do {
    shuffled = array.slice().sort(() => Math.random() - 0.5);
  } while (shuffled.some((val, idx) => val === idx));
  return shuffled;
}

function createPuzzle() {
  puzzleContainer.innerHTML = "";
  positions = Array.from({ length: 9 }, (_, i) => i);
  correctPositions = [...positions];
  const shuffled = shuffle(positions);
  shuffled.forEach((pos, i) => {
    const div = document.createElement("div");
    div.className = "piece";
    div.dataset.index = i;
    div.dataset.correct = pos;
    div.style.backgroundImage = "url('Files/cat.jpg')";
    div.style.backgroundPosition = `${(pos % 3) * 100}% ${(Math.floor(pos / 3)) * 100}%`;
    puzzleContainer.appendChild(div);
  });
}

let first = null;

function handleClick(e) {
  if (!e.target.classList.contains("piece")) return;
  clickSound.play();
  const clicked = e.target;
  if (!first) {
    first = clicked;
    clicked.classList.add("selected");
  } else if (clicked !== first) {
    swapSound.play();
    const firstIndex = first.dataset.index;
    const secondIndex = clicked.dataset.index;
    const tempPos = first.style.backgroundPosition;
    const tempCorrect = first.dataset.correct;

    first.style.backgroundPosition = clicked.style.backgroundPosition;
    first.dataset.correct = clicked.dataset.correct;

    clicked.style.backgroundPosition = tempPos;
    clicked.dataset.correct = tempCorrect;

    first.classList.remove("selected");
    first = null;
    moves++;
    movesDisplay.textContent = moves;

    checkWin();
  }
}

function checkWin() {
  const pieces = document.querySelectorAll(".piece");
  let win = true;
  pieces.forEach((piece, idx) => {
    if (parseInt(piece.dataset.correct) !== idx) win = false;
  });
  if (win) {
    clearInterval(timerInterval);
    winSound.play();
    scoreDisplay.textContent = 100 - moves * 2;
    winMessage.classList.remove("hidden");
    nextButton.disabled = false;
  }
}

startButton.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Veuillez entrer votre nom");
  playerDisplay.textContent = name;
  startScreen.classList.add("hidden");
  gameUI.classList.remove("hidden");
  winMessage.classList.add("hidden");
  nextButton.disabled = true;
  scoreDisplay.textContent = 0;
  movesDisplay.textContent = 0;
  startTimer();
  createPuzzle();
  puzzleContainer.onclick = handleClick;
};

replayButton.onclick = () => {
  winMessage.classList.add("hidden");
  nextButton.disabled = true;
  scoreDisplay.textContent = 0;
  movesDisplay.textContent = 0;
  startTimer();
  createPuzzle();
};

nextButton.onclick = () => {
  alert("🎉 Bravo ! Vous pouvez passer au niveau 2 (à venir).");
};
