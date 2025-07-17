const puzzle = document.getElementById("puzzle");
const message = document.getElementById("message");
const size = 3; // 3x3 puzzle
let pieces = [];

function createPuzzle() {
  const indices = [...Array(size * size).keys()];
  shuffle(indices);

  for (let i = 0; i < indices.length; i++) {
    const idx = indices[i];
    const row = Math.floor(idx / size);
    const col = idx % size;

    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.dataset.index = idx;
    piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;

    piece.addEventListener("click", () => handleClick(piece));
    puzzle.appendChild(piece);
    pieces.push(piece);
  }

  if (isSolved()) {
    puzzle.innerHTML = "";
    pieces = [];
    createPuzzle(); // re-shuffle si résolu dès le début
  }
}

let first = null;

function handleClick(piece) {
  if (!first) {
    first = piece;
    piece.style.border = "2px solid red";
  } else if (piece !== first) {
    swap(first, piece);
    first.style.border = "";
    first = null;
    if (isSolved()) {
      message.style.display = "block";
    }
  }
}

function swap(p1, p2) {
  const bg1 = p1.style.backgroundPosition;
  const bg2 = p2.style.backgroundPosition;
  const i1 = p1.dataset.index;
  const i2 = p2.dataset.index;

  p1.style.backgroundPosition = bg2;
  p2.style.backgroundPosition = bg1;
  p1.dataset.index = i2;
  p2.dataset.index = i1;
}

function isSolved() {
  return pieces.every((p, i) => parseInt(p.dataset.index) === i);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

createPuzzle();
