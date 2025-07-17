const image = "files/cat.jpg"; // choisis ici : cat.jpg, cat2.jpg ou PUB.png
const puzzle = document.getElementById("puzzle");
const message = document.getElementById("message");
const size = 3;
let pieces = [];

function createPuzzle() {
  const indices = [...Array(size * size).keys()];
  shuffle(indices);

  for (let i = 0; i < indices.length; i++) {
    const idx = indices[i];
    const row = Math.floor(idx / size);
    const col = idx % size;

    const piece = document.createElement("div");
    piece.className = "piece";
    piece.dataset.index = idx;
    piece.style.backgroundImage = `url(${image})`;
    piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;

    piece.addEventListener("click", () => handleClick(piece));
    puzzle.appendChild(piece);
    pieces.push(piece);
  }

  if (isSolved()) {
    puzzle.innerHTML = "";
    pieces = [];
    createPuzzle();
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
      enlargeImage();
    }
  }
}

function swap(p1, p2) {
  const pos1 = p1.style.backgroundPosition;
  const pos2 = p2.style.backgroundPosition;
  const index1 = p1.dataset.index;
  const index2 = p2.dataset.index;

  p1.style.backgroundPosition = pos2;
  p2.style.backgroundPosition = pos1;
  p1.dataset.index = index2;
  p2.dataset.index = index1;
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

function enlargeImage() {
  puzzle.innerHTML = "";
  const img = document.createElement("img");
  img.src = image;
  img.style.width = "300px";
  puzzle.appendChild(img);
}

createPuzzle();
