// script.js
const board = document.getElementById("puzzle-board");
const startButton = document.getElementById("start-button");
const playerNameInput = document.getElementById("player-name");
const message = document.querySelector(".message");
let pieces = [];
let firstSelected = null;
let moves = 0;

const gridSize = 3;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createPieces(imageUrl) {
  board.innerHTML = "";
  pieces = [];

  const order = Array.from({ length: gridSize * gridSize }, (_, i) => i);
  shuffle(order);

  for (let i = 0; i < gridSize * gridSize; i++) {
    const piece = document.createElement("div");
    piece.className = "piece";

    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    const bgX = (col / (gridSize - 1)) * 100;
    const bgY = (row / (gridSize - 1)) * 100;

    piece.style.backgroundImage = `url('${imageUrl}')`;
    piece.style.backgroundPosition = `${bgX}% ${bgY}%`;

    piece.dataset.correctIndex = i;
    piece.dataset.currentIndex = order[i];

    pieces.push(piece);
    board.appendChild(piece);
  }

  updatePositions();
}

function updatePositions() {
  pieces.forEach((piece, i) => {
    const index = parseInt(piece.dataset.currentIndex);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    piece.style.gridRowStart = row + 1;
    piece.style.gridColumnStart = col + 1;

    piece.onclick = () => handlePieceClick(piece);
  });
}

function handlePieceClick(piece) {
  if (!firstSelected) {
    firstSelected = piece;
    piece.style.outline = "2px solid red";
  } else if (piece !== firstSelected) {
    const tmp = piece.dataset.currentIndex;
    piece.dataset.currentIndex = firstSelected.dataset.currentIndex;
    firstSelected.dataset.currentIndex = tmp;

    firstSelected.style.outline = "none";
    firstSelected = null;

    updatePositions();
    moves++;

    if (checkWin()) {
      message.innerHTML = `✨ Bravo ! Vous avez terminé le puzzle en ${moves} coups.`;
      document.getElementById("next-button").disabled = false;
    }
  }
}

function checkWin() {
  return pieces.every(p => p.dataset.correctIndex === p.dataset.currentIndex);
}

startButton.onclick = () => {
  const name = playerNameInput.value.trim();
  if (name === "") {
    alert("Veuillez saisir votre nom");
    return;
  }
  document.querySelector(".top-bar").innerHTML = `✦ ${name} | Score: 0 <button id='restart-button'>Rejouer</button> Niveau 1 <button id='next-button' disabled>Niveau 2</button>`;

  createPieces("Files/cat.jpg");
  message.innerHTML = "";
};
