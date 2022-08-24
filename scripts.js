
let yourScore = document.querySelector(".score-container");
let bestScore = document.querySelector(".best-container");
let gameMessage = document.querySelector('.game-message');
let fieldMatrix = [];
let prevfieldMatrix = [];

const newGameBtn = document.querySelector('.restart-button').onclick = () => {startNewGame() };
const retryButton = document.querySelector('.retry-button').onclick = () => {startNewGame() };

const initField = () => {
  let fieldMatrix = new Array(4).fill().map(() => new Array(4).fill(null));
  let notMatch = false;
  yourScore.innerHTML = 0;
  while (notMatch === false) {
    let x1 = getRandom(0, 4);
    let y1 = getRandom(0, 4);
    let x2 = getRandom(0, 4);
    let y2 = getRandom(0, 4);
    notMatch = x1 != x2 || y1 != y2;
    if (notMatch) {
      fieldMatrix[x1][y1] = 2;
      fieldMatrix[x2][y2] = 2;
    }
  }
  return fieldMatrix;
}

const startNewGame = () => {
  fieldMatrix = initField();
  localStorage.setItem('score', '0');
  saveField();
  fillField(fieldMatrix);
  gameMessage.dataset.display = "none";
}

const isGameOver = () => {
  for (let x = 0; x < fieldSize; x++) {
    if (fieldMatrix[x].includes(null)) {
      console.log('вышел были нули');
      return false;
    }
  }
  for (let y = 0; y < fieldSize; y++) {
    for (let x = 0; x < fieldSize; x++) {
      let x2 = x + 1;
      let y2 = y + 1;
      if (x2 === fieldSize){x2 = x - 1}
      if (y2 === fieldSize){y2 = y -1}
      console.log(`-----------------------------------`);
      console.log(` до сравнения y = ${y} x = ${x} x2 = ${x2}`);
      console.log(` до сравненияy у = ${y} x = ${x} y2 = ${y2}`);
        console.log(` сравниваем y = ${y} x = ${x} x2 = ${x2}`);
        if (fieldMatrix[y][x] === fieldMatrix[y][x2]) {
          return false;
        }
        console.log(` сравниваем у = ${y}  y2 = ${y2} x = ${x}`);
        if (fieldMatrix[y][x] === fieldMatrix[y2][x]) {
          return false;
        }
      
    }
  }
  gameMessage.dataset.display = "show";
}

const getRandom = (min, max) => {
  min = Math.ceil(min + 1);  //добавляем 1 для искулючения умножения на ноль
  max = Math.floor(max + 1);
  return Math.floor(Math.random() * (max - min)) + min - 1;  //вычитаем 1 для получения коректного значения
}

const fillField = () => {
  let cells = document.getElementsByClassName("grid-cell");
  let z = 0;
  for (let y = 0; y < fieldSize; y++) {
    for (let x = 0; x < fieldSize; x++) {
      cells[z].innerHTML = fieldMatrix[y][x];
      cells[z].classList.add('grid-cell')
      cells[z].dataset.value = cells[z].textContent;
      z++
    }
  }
}

const pushNewElement = () => {
  const emptyPlace = [];
  let isFreePlace = false;
  let newElement = getRandom(1, 10) < 9 ? 2 : 4;
  for (let y = 0; y < fieldSize; y++) {
    for (let x = 0; x < fieldSize; x++) {
      if (fieldMatrix[y][x] === null) {
        emptyPlace.push([y, x]);
        isFreePlace = true;
      }
    }
  }
  if (isFreePlace) {
    randomIndex = getRandom(0, emptyPlace.length - 1);
    fieldMatrix[emptyPlace[randomIndex][0]][emptyPlace[randomIndex][1]] = newElement;
    console.log()
  }

  else {
    return false;
  }
}

const isSameField = () => {
  console.log
  if (JSON.stringify(fieldMatrix) != JSON.stringify(prevfieldMatrix)) {
    return true;
  }
  else {
    return false
  };
}

const saveField = () => {
  localStorage.setItem('field', JSON.stringify(fieldMatrix));
}

const updateScore = (newValue) => {
  yourScore.innerHTML = +yourScore.textContent + newValue;
  localStorage.setItem('score', yourScore.textContent);
  if (+yourScore.textContent > +localStorage.getItem('bestScore')) {
    localStorage.setItem('bestScore', yourScore.textContent);
    bestScore.innerHTML = localStorage.getItem('bestScore');
  }
}

const updateStorage = () => {
  localStorage.setItem('score', yourScore.textContent);
  localStorage.setItem('field', JSON.stringify(fieldMatrix));
  if (+yourScore.textContent > +localStorage.getItem('bestScore')) {
    localStorage.setItem('bestScore', yourScore.textContent);
    bestScore.innerHTML = localStorage.getItem('bestScore');
  }
}

const pressArrowUp = () => {
  for (let x = 0; x < fieldSize; x++) {
    for (let y = 0; y < fieldSize; y++) {
      if (fieldMatrix[y][x] === null) {
        continue;
      }
      for (let y2 = y + 1; y2 < fieldSize; y2++) {
        if (fieldMatrix[y2][x] === null) {
          continue;
        }
        if (fieldMatrix[y][x] === fieldMatrix[y2][x]) {
          fieldMatrix[y][x] *= 2;
          fieldMatrix[y2][x] = null;
          updateScore(fieldMatrix[y][x]);
          y = y2;
        } else {
          y = y2 - 1;
        }
        break;
      }
    }

    let y3 = 0;
    for (let y = 1; y < fieldSize; y++) {
      if (fieldMatrix[y][x] === null) {
        continue;
      }
      if (fieldMatrix[y3][x] != null) {
        y3++;
      }
      if (y3 === y) {
        continue;
      }
      fieldMatrix[y3][x] = fieldMatrix[y][x];
      fieldMatrix[y][x] = null;
    }
  }
  if (isSameField()) {
    pushNewElement();
  }
}

const pressArrowRight = () => {
  for (let y = 0; y < fieldSize; y++) {
    for (let x = fieldSize - 1; x > 0; x--) {
      if (fieldMatrix[y][x] === null) {
        continue;
      }
      for (let x2 = x - 1; x2 >= 0; x2--) {
        if (fieldMatrix[y][x2] === null) {
          continue;
        }
        if (fieldMatrix[y][x] === fieldMatrix[y][x2]) {
          fieldMatrix[y][x] *= 2;
          fieldMatrix[y][x2] = null;
          updateScore(fieldMatrix[y][x]);
          x = x2;
        } else {
          x = x2 + 1;
        }
        break;
      }
    }

    let x3 = fieldSize - 1;
    for (let x = fieldSize - 2; x >= 0; x--) {
      if (fieldMatrix[y][x] === null) {
        continue;
      }
      if (fieldMatrix[y][x3] != null) {
        x3--;
      }
      if (x3 === x) {
        continue;
      }
      fieldMatrix[y][x3] = fieldMatrix[y][x];
      fieldMatrix[y][x] = null;
    }
  }
  if (isSameField()) {
    pushNewElement();
  }
}
const pressArrowDown = () => {
  for (let x = 0; x < fieldSize; x++) {
    for (let y = fieldSize - 1; y > 0; y--) {
      if (fieldMatrix[y][x] === null) {
        continue;
      }
      for (let y2 = y - 1; y2 >= 0; y2--) {
        if (fieldMatrix[y2][x] === null) {
          continue;
        }
        if (fieldMatrix[y][x] === fieldMatrix[y2][x]) {
          fieldMatrix[y][x] *= 2;
          fieldMatrix[y2][x] = null;
          updateScore(fieldMatrix[y][x]);
          y = y2;
        } else {
          y = y2 + 1;
        }
        break;
      }
    }

    let y3 = fieldSize - 1;
    for (let y = fieldSize - 2; y >= 0; y--) {
      if (fieldMatrix[y][x] === null) {
        continue;
      }
      if (fieldMatrix[y3][x] != null) {
        y3--;
      }
      if (y3 === y) {
        continue;
      }
      fieldMatrix[y3][x] = fieldMatrix[y][x];
      fieldMatrix[y][x] = null;
    }
  }
  if (isSameField()) {
    pushNewElement();
  }
}

const pressArrowLeft = () => {
  for (let y = 0; y < fieldSize; y++) {
    for (let x = 0; x < fieldSize; x++) {
      if (fieldMatrix[y][x] === null) {
        continue;
      }
      for (let x2 = x + 1; x2 < fieldSize; x2++) {
        if (fieldMatrix[y][x2] === null) {
          continue;
        }
        if (fieldMatrix[y][x] === fieldMatrix[y][x2]) {
          fieldMatrix[y][x] *= 2;
          fieldMatrix[y][x2] = null;
          updateScore(fieldMatrix[y][x]);
          x = x2;

        } else {
          x = x2 - 1;
        }
        break;
      }
    }

    let x3 = 0;
    for (let x = 1; x < fieldSize; x++) {
      if (fieldMatrix[y][x] === null) {
        continue;
      }
      if (fieldMatrix[y][x3] != null) {
        x3++;
      }
      if (x3 === x) {
        continue;
      }
      fieldMatrix[y][x3] = fieldMatrix[y][x];
      fieldMatrix[y][x] = null;
    }
  }
  if (isSameField()) {
    pushNewElement();
  }
}

document.addEventListener('keydown', function (event) {
  if (event.code === 'ArrowUp') {
    pressArrowUp();
  }

  if (event.code === 'ArrowDown') {
    pressArrowDown();
  }

  if (event.code === 'ArrowLeft') {
    pressArrowLeft();

  }

  if (event.code === 'ArrowRight') {
    pressArrowRight();
  }
  isGameOver();
  fillField();
  saveField();
  prevfieldMatrix = JSON.parse(localStorage.getItem('field'));
});

if (!localStorage.getItem('bestScore')) {
  localStorage.setItem('bestScore', '0');
}
bestScore.innerHTML = localStorage.getItem('bestScore');

if (localStorage.getItem('field')) {
  fieldMatrix = JSON.parse(localStorage.getItem('field'));
  yourScore.innerHTML = localStorage.getItem('score');
}
else {
  fieldMatrix = initField();
}

const fieldSize = fieldMatrix.length;

fillField();

isGameOver();


