// 1. Add other shapes
// 2. Style new shapes to your liking
// 3. Add a random function that will generate a random shape
// 4. Price the shape when it appears
// 5. Add a random colour function for each new shape

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

const TETROMINO_NAMES = [
    'O',
    'L',
    'J',
    'S',
    'Z',
    'T'
];

const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ]
};

let playfield;
let tetromino;

function convertPositionToIndex(row, column){
    return row * PLAYFIELD_COLUMNS + column;
}

function generatePlayfield(){
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++){
        const div = document.createElement('div');
        document.querySelector('.tetris').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
                    .map(()=> new Array(PLAYFIELD_COLUMNS).fill(0))
    // console.log(playfield);
}
function generateTetromino(){
    const nameTetro   = 'L';
    const matrixTetro = TETROMINOES[nameTetro];

    const rowTetro    = 3;
    const columnTetro = 4;

    tetromino = {
        name: nameTetro,
        matrix: matrixTetro,
        row: rowTetro,
        column: columnTetro,
    }
}

generatePlayfield();
generateTetromino();
const cells = document.querySelectorAll('.tetris div');
// console.log(cells);

function drawPlayField(){

    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            // if(playfield[row][column] == 0) { continue };
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }

}

function drawTetromino(){
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++){
            if(tetromino.matrix[row][column] == 0){ continue }
            
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            cells[cellIndex].classList.add(name);
        }
    }
}

drawTetromino();

function draw(){
    cells.forEach(function(cell){ cell.removeAttribute('class')});
    drawPlayField();
    drawTetromino();
    console.table(playfield)
}

document.addEventListener('keydown', onKeyDown)

function onKeyDown(event){
    console.log(event);
    switch(event.key){
        case 'ArrowDown':
            moveTetrominoDown();
            break;
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
            moveTetrominoRight();
            break;
    }
    draw();
}

function moveTetrominoDown(){
    tetromino.row += 1;
    if(isOutsideOfGameBoard()){
        tetromino.row -= 1;
        placeTetromino();
    }
}
function moveTetrominoLeft(){
    tetromino.column -= 1;
    if(isOutsideOfGameBoard()){
        tetromino.column += 1;
    }
}
function moveTetrominoRight(){
    tetromino.column += 1;
    if(isOutsideOfGameBoard()){
        tetromino.column -= 1;
    }
}

function isOutsideOfGameBoard(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            if(!tetromino.matrix[row][column]){ continue; }
            if(
                tetromino.column + column < 0 ||
                tetromino.column + column >= PLAYFIELD_COLUMNS ||
                tetromino.row + row >= playfield.length
                ){
                return true;
            }
        }
    }
    return false;
}

function placeTetromino(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            if(!tetromino.matrix[row][column]) continue;

            playfield[tetromino.row + row][tetromino.column + column] = TETROMINO_NAMES[0];
        }
    }
    generateTetromino();
}






















