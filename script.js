const image = "files/cat.jpg"; // change ici si tu veux cat2.jpg ou PUB.png
const puzzle = document.getElementById("puzzle");
const message = document.getElementById("message");
const size = 3;
let pieces = [];
let firstPiece = null;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createPuzzle() {
  const indices = [...Array(size * size).keys()];
  shuffle(indices);

  puzzle.innerHTML = "";
  pieces = [];

  for (let i = 0; i < indices.length; i++) {
    const correctIndex = i;
    const shuffledIndex = indices[i];

    const row = Math.floor(shuffledIndex / size);
    const col = shuffledIndex % size;

    const piece = document.createElement("div");
    piece.className = "piece";
    piece.dataset.correctIndex = correctIndex;
    piece.dataset.currentIndex = shuffledIndex;
    piece.style.backgroundImage = `url(${image})`;
    piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;

    piece.addEventListener("click", () => handleClick(piece));

    puzzle.appendChild(piece);
    pieces.push(piece);
  }

  if (isSolved()) {
    createPuzzle(); // évite un puzzle déjà résolu
  }
}

function handleClick(piece) {
  if (!firstPiece) {
    firstPiece = piece;
    piece.style.border = "2px solid red";
  } else if (piece !== firstPiece) {
    swapPieces(firstPiece, piece);
    firstPiece.style.border = "";
    firstPiece = null;

    if (isSolved()) {
      showVictory();
    }
  }
}

function swapPieces(p1, p2) {
  const tempPos = p1.style.backgroundPosition;
  const tempIndex = p1.dataset.currentIndex;

  p1.style.backgroundPosition = p2.style.backgroundPosition;
  p1.dataset.currentIndex = p2.dataset.currentIndex;

  p2.style.backgroundPosition = tempPos;
  p2.dataset.currentIndex = tempIndex;
}

function isSolved() {
  return pieces.every((p, i) => parseInt(p.dataset.currentIndex) === i);
}

function showVictory() {
  message.style.display = "block";
  puzzle.innerHTML = `<img src="${image}" width="300" height="300">`;
}

createPuzzle();
