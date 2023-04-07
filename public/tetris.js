const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const grid = 32;

var tetrominoSequence = [];


var playfield = [];

let score = 0;

for (let row = -2; row < 13; row++) {
  playfield[row] = [];

  for (let col = 0; col < 12; col++) {
    playfield[row][col] = 0;
  }
}


const tetrominos = {
  'I': [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  'J': [
    [1,0,0],
    [1,1,1],
    [0,0,0],
  ],
  'L': [
    [0,0,1],
    [1,1,1],
    [0,0,0],
  ],
  'O': [
    [1,1],
    [1,1],
  ],
  'S': [
    [0,1,1],
    [1,1,0],
    [0,0,0],
  ],
  'Z': [
    [1,1,0],
    [0,1,1],
    [0,0,0],
  ],
  'T': [
    [0,1,0],
    [1,1,1],
    [0,0,0],
  ]
};

const colors = {
  'I': 'cyan',
  'O': 'yellow',
  'T': 'purple',
  'S': 'green',
  'Z': 'red',
  'J': 'blue',
  'L': 'orange'
};


let count = 0;

let tetromino = getNextTetromino();

let rAF = null;  

let gameOver = false;


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function generateSequence() {

  const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  while (sequence.length) {

    const rand = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(rand, 1)[0];

    tetrominoSequence.push(name);
  }
}


function getNextTetromino() {
 
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }

  const name = tetrominoSequence.pop();

  const matrix = tetrominos[name];


  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

  const row = name === 'I' ? -1 : -2;

  return {
    name: name,     
    matrix: matrix,  
    row: row,        
    col: col        
  };
}


function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i])
  );

  return result;
}

// проверяем после появления или вращения, может ли матрица (фигура) быть в этом месте поля или она вылезет за его границы
function isValidMove(matrix, cellRow, cellCol) {
  // проверяем все строки и столбцы
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] && (
          // если выходит за границы поля…
          cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          // …или пересекается с другими фигурами
          playfield[cellRow + row][cellCol + col])
        ) {
        // то возвращаем, что нет, так не пойдёт
        return false;
      }
    }
  }
  // а если мы дошли до этого момента и не закончили раньше — то всё в порядке
  return true;
}

// когда фигура окончательна встала на своё место
function placeTetromino() {
  // обрабатываем все строки и столбцы в игровом поле
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {

        // если край фигуры после установки вылезает за границы поля, то игра закончилась
        if (tetromino.row + row < 0) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/save-score', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    console.log(xhr.responseText);
                }
            };
            xhr.send(`score=${score}`);
          return showGameOver();
        }
        // если всё в порядке, то записываем в массив игрового поля нашу фигуру
        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    } 
  }

  // проверяем, чтобы заполненные ряды очистились снизу вверх
  for (let row = playfield.length - 1; row >= 0; ) {
    // если ряд заполнен
    if (playfield[row].every(cell => !!cell)) {
        score +=10;
      // очищаем его и опускаем всё вниз на одну клетку
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r-1][c];
        }
      }
    }
    else {
      // переходим к следующему ряду
      row--;
    }
  }
  // получаем следующую фигуру
  tetromino = getNextTetromino();
}


function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;

    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
}
function drawScore(){
    context.font = "16px arial";
    context.fillStyle ="#fff"
    context.fillText ("Счет: " +score, 8, 20);
}


// главный цикл игры
function loop() {
  // начинаем анимацию
  rAF = requestAnimationFrame(loop);
  // очищаем холст
  context.clearRect(0,0,canvas.width,canvas.height);

  // рисуем игровое поле с учётом заполненных фигур
  for (let row = 0; row < 13; row++) {
    for (let col = 0; col < 13; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];

        // рисуем всё на один пиксель меньше, чтобы получился эффект «в клетку»
        context.fillRect(col * grid, row * grid, grid-1, grid-1);
      }
    }
  }

  // рисуем текущую фигуру
  if (tetromino) {

    // фигура сдвигается вниз каждые 35 кадров
    if (++count > 35) {
      tetromino.row++;
      count = 0;

      // если движение закончилось — рисуем фигуру в поле и проверяем, можно ли удалить строки
      if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }

    // не забываем про цвет текущей фигуры
    context.fillStyle = colors[tetromino.name];

    // отрисовываем её
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {

          // и снова рисуем на один пиксель меньше
          context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
        }
      }
    }
  }
  drawScore();
}

// следим за нажатиями на клавиши
document.addEventListener('keydown', function(e) {
  // если игра закончилась — сразу выходим
  if (gameOver) return;

  // стрелки влево и вправо
  if (e.which === 37 || e.which === 39) {
    const col = e.which === 37
      // если влево, то уменьшаем индекс в столбце, если вправо — увеличиваем
      ? tetromino.col - 1
      : tetromino.col + 1;

    // если так ходить можно, то запоминаем текущее положение 
    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }

  // стрелка вверх — поворот
  if (e.which === 38) {
    // поворачиваем фигуру на 90 градусов
    const matrix = rotate(tetromino.matrix);
    // если так ходить можно — запоминаем
    if (isValidMove(matrix, tetromino.row, tetromino.col)) {
      tetromino.matrix = matrix;
    }
  }

  // стрелка вниз — ускорить падение
  if(e.which === 40) {
    // смещаем фигуру на строку вниз
    const row = tetromino.row + 1;
    // если опускаться больше некуда — запоминаем новое положение
    if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
      tetromino.row = row - 1;
      // ставим на место и смотрим на заполненные ряды
      placeTetromino();
      return;
    }
    // запоминаем строку, куда стала фигура
    tetromino.row = row;
  }
});

// старт игры
rAF = requestAnimationFrame(loop);