//creating const variables for game

const fieldWrapper = document.querySelector(".tetris-field");
const nextWrapper = document.querySelector(".next-field");
const linesField = document.querySelector(".lines span");
const scoreField = document.querySelector(".score span");
const speedField = document.querySelector(".speed span");
const levelField = document.querySelector(".level span");
const pauseButton = document.querySelector(".pause button");
const startButton = document.querySelector(".start button");
const pauseImg = document.querySelector(".pause img");

//start button

startButton.innerText = "Start";
startButton.addEventListener("click", () => {
    startGame();
})

// pause button

pauseButton.innerText = "Pause";
pauseButton.disabled = true;
pauseButton.addEventListener("click", () => {
    if(!pauseStatus){
        clearInterval(timerId);
        document.removeEventListener("keydown", keyHandler);
        pauseStatus = true;
        pauseButton.innerText = "Resume";
        pauseImg.style.display = "block";
    }
    else{
        document.addEventListener("keydown", keyHandler);
        timerId = setInterval(moveDown, timerSpeed);
        pauseStatus = false;
        pauseButton.innerText = "Pause";
        pauseImg.style.display = "none";
    }
    
});

// variables and creating vigures

const fieldRows = 20;
const fieldCols = 10;
const figureNames = ["o", "l", "j", "s", "z", "i", "t"];
const figures = {
    //cube 1x1
    o: [
        [
            [1, 1],
            [1, 1],
        ],
    ],
    // L
    l: [
        [
            [0, 0, 1],
            [1, 1, 1],
        ],
        [
            [1, 0],
            [1, 0],
            [1, 1],
        ],
        [
            [1, 1, 1],
            [1, 0, 0],
        ],
        [
            [1, 1],
            [0, 1],
            [0, 1],
        ],
    ],
    //j
    j: [
        [
            [1, 0, 0],
            [1, 1, 1],
        ],
        [
            [1, 1],
            [1, 0],
            [1, 0],
        ],
        [
            [1, 1, 1],
            [0, 0, 1],
        ],
        [
            [0, 1],
            [0, 1],
            [1, 1],
        ],
    ],
    //s
    s: [
        [
            [0, 1, 1],
            [1, 1, 0],
        ],
        [
            [1, 0],
            [1, 1],
            [0, 1],
        ],
    ],
    //z
    z: [
        [
            [1, 1, 0],
            [0, 1, 1],
        ],
        [
            [0, 1],
            [1, 1],
            [1, 0],
        ],
    ],
    //I
    i: [[[1, 1, 1, 1]], [[1], [1], [1], [1]]],
    //t
    t: [
        [
            [0, 1, 0],
            [1, 1, 1],
        ],
        [
            [1, 0],
            [1, 1],
            [1, 0],
        ],
        [
            [1, 1, 1],
            [0, 1, 0],
        ],
        [
            [0, 1],
            [1, 1],
            [0, 1],
        ],
    ],
};

//creating variables for navigation line

let lines, score, speed, level, timerId, gameField, prevGameField, nextField;
let timerSpeed = 600;
let pauseStatus = false;
let blockMove = false;

//firsttime functions

let currentFigure = createFigure();
let nextFigure = createFigure();

function randomColor(){return Math.floor(20 + Math.random() * 220)};
function randomFigure(){return figureNames[Math.floor(Math.random() * 7)]};

// let's start game function

function startGame(){
    
    gameField = [];
    nextField = [];
    prevGameField = [];
    
    lines = 0;
    score = 0;
    speed = 0;
    level = 0;
    pauseButton.disabled = false;

    createField();
    createNextField();
    drawFigure(currentFigure);
    drawNextFigure(nextFigure);

    linesField.innerText = lines.toString().padStart(6, "0");
    scoreField.innerText = score.toString().padStart(9, "0");
    speedField.innerText = speed;
    levelField.innerText = level;

    document.addEventListener("keydown", keyHandler);
    timerId = setInterval(moveDown, timerSpeed);

    startButton.disabled = true;
}

// end game over

function gameOver(){
    
    clearInterval(timerId);
    document.removeEventListener("keydown", keyHandler);
    pauseButton.disabled = true;
    startButton.disabled = false;
    console.log("GAME OVER");
    
}

// creating next field

function createNextField(){
    nextWrapper.replaceChildren();
    for(let i = 0; i < 4; i++){
        nextField[i] = [];
        for(let j = 0; j < 4; j++){
            const cell = document.createElement("div");
            cell.className = "cell";
            nextField[i][j] = cell;
            nextWrapper.append(cell);
        }
    }
}

//creating next figure

function drawNextFigure(nextFigure){
    for(let i = 0; i < nextFigure.type[0].length; i++){
        for(let j = 0; j < nextFigure.type[0][0].length; j++){
            if(nextFigure.type[0][i][j] === 1){
                //colour and figure
                nextField[i][j].style.backgroundColor = `rgb(${nextFigure.color})`;
                nextField[i][j].classList.add("figure");
            }
        }
    }
}

//creating field

function createField() {
    fieldWrapper.replaceChildren();
    if(prevGameField.length === 0){
        for (let i = 0; i < fieldRows; i++) {
            gameField[i] = [];
            for (let j = 0; j < fieldCols; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.data = 0;
                
                
                gameField[i][j] = cell;
                fieldWrapper.append(cell);
            }
        }
    }
    else if (prevGameField.length > 0) {
        for (let i = 0; i < fieldRows; i++) {
            gameField[i] = [];
            for (let j = 0; j < fieldCols; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.data = 0;
                if(prevGameField[i][j].stop === true){
                    cell.data = 1;
                    cell.stop = true;
                    cell.style.backgroundColor = `${prevGameField[i][j].color}`;
                    cell.classList.add("figure");
                }
                
                
                gameField[i][j] = cell;
                fieldWrapper.append(cell);
            }
        }
    }
}

//creating figure

function createFigure(){
    const figure = {
        x: 4,
        y: 0,
        type: figures[randomFigure()],
        rotate: 0,
        color: [randomColor(), randomColor(), randomColor()],
    };
    return figure;
}

//drawing figure in the field

function drawFigure(currentFigure) {
console.log(`draw figure ${currentFigure.color}`);
    const figure = currentFigure.type[currentFigure.rotate];
    const height = figure.length;
    const width = figure[0].length;
    
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const currentCell = gameField[i + currentFigure.y][j + currentFigure.x];

            if(gameField[i + currentFigure.y] && gameField[j + currentFigure.x] && figure[i][j] === 1){
                if (currentCell.stop) {
                    gameOver();
                    return;
                }
                
                
                currentCell.data = figure[i][j];
                currentCell.style.backgroundColor = `rgb(${currentFigure.color})`;
                currentCell.classList.add("figure");
                
                
            }
        }
    }
}

// one step for field update

function stepFieldUpdate(){
    if(blockMove) return;
    console.log("step update");
    createField();
    drawFigure(currentFigure);
}

//and full field updating

function fullFieldUpdate(){
    if(blockMove) return;
    console.log("full update");
    prevGameField = Array.from(gameField);
    createField();

    currentFigure = nextFigure;
    drawFigure(currentFigure);

    nextFigure = createFigure();
    createNextField();
    drawNextFigure(nextFigure);
}

//keys 

function keyHandler(e){
    console.log(e);
    switch (e.key) {
        case "ArrowLeft":
            
            moveLeft();
            break;
        case "ArrowRight":
            
            moveRight();
            break;
        case "ArrowDown":
            
            moveDown();
            break;
        case "ArrowUp":
            
            rotate();
            break;
        case " ":
            fallDown();
            break;

        default:
            break;
    }
}

//left 

function moveLeft(){
    if(currentFigure.x !== 0 && checkNextStep("left")){
        currentFigure.x -= 1;
        stepFieldUpdate();
    }
}

//right

function moveRight() {
    if (currentFigure.x < (fieldCols - currentFigure.type[currentFigure.rotate][0].length) && checkNextStep("right")) {
        currentFigure.x += 1;
        stepFieldUpdate();
    }
}

//down

function moveDown() {
    if (currentFigure.y < fieldRows - currentFigure.type[currentFigure.rotate].length && checkNextStep("down")) {
        currentFigure.y += 1;
        stepFieldUpdate();
    }
    else{
        if(!blockMove){
            stopPosition();
            checkFullRows();
        }
    }
}

//rotate

function rotate(){
    const prevRotatePosition = currentFigure.rotate;

    currentFigure.type[currentFigure.rotate + 1] ? currentFigure.rotate += 1 : currentFigure.rotate = 0;
    
    if(currentFigure.x > (fieldCols - currentFigure.type[currentFigure.rotate][0].length)){
        do {
            currentFigure.x -= 1;
        } while (currentFigure.x > (fieldCols - currentFigure.type[currentFigure.rotate][0].length));
    }
    if(currentFigure.y > (fieldRows - currentFigure.type[currentFigure.rotate].length)){
        do {
            currentFigure.y -= 1;
        } while (currentFigure.y > (fieldRows - currentFigure.type[currentFigure.rotate].length));
    }
    if (!checkNextStep("rotate")) {
        currentFigure.rotate = prevRotatePosition;
        return;
    }
    stepFieldUpdate();
}

//fall down

function fallDown() {
    console.log("fall down");
    while(currentFigure.y < fieldRows - currentFigure.type[currentFigure.rotate].length && checkNextStep("down")) {
        currentFigure.y += 1;
        console.log("---");
        stepFieldUpdate();
    }
    if(!blockMove){
        stopPosition();
        checkFullRows();
    }
}

//stoping

function stopPosition(){
    console.log("stop position");
    
    for(let i = 0; i < fieldRows; i++){
        for(let j = 0; j < fieldCols; j++){
            if(gameField[i][j].data === 1){
                gameField[i][j].stop = true;
                const style = getComputedStyle(gameField[i][j]);
                gameField[i][j].color = style.backgroundColor;
            }
        }
    }
}

// next step

function checkNextStep(move = "down"){
    let count = [];
    switch (move) {

        case "down":
            for(let i = 0; i < currentFigure.type[currentFigure.rotate].length; i++){
                for(let j = 0; j < currentFigure.type[currentFigure.rotate][0].length; j++){
                    if(currentFigure.type[currentFigure.rotate][i][j] === 0) continue;
                    if(currentFigure.type[currentFigure.rotate][i][j] === 1 && gameField[i + currentFigure.y + 1][j + currentFigure.x].stop !== true){
                        count.push(1);
                    }
                    else{
                        count.push(0);
                    }
                }
            }
            return count.every(el => el === 1) ? true : false;

        case "right":
            for(let i = 0; i < currentFigure.type[currentFigure.rotate].length; i++){
                for(let j = 0; j < currentFigure.type[currentFigure.rotate][0].length; j++){
                    if(currentFigure.type[currentFigure.rotate][i][j] === 0) continue;
                    if(currentFigure.type[currentFigure.rotate][i][j] === 1 && gameField[i + currentFigure.y][j + currentFigure.x + 1].stop !== true){
                        count.push(1);
                    }
                    else{
                        count.push(0);
                    }
                }
            }
            return count.every((el) => el === 1) ? true : false;

        case "left":
            for(let i = 0; i < currentFigure.type[currentFigure.rotate].length; i++){
                for(let j = 0; j < currentFigure.type[currentFigure.rotate][0].length; j++){
                    if(currentFigure.type[currentFigure.rotate][i][j] === 0) continue;
                    if(currentFigure.type[currentFigure.rotate][i][j] === 1 && gameField[i + currentFigure.y][j + currentFigure.x - 1].stop !== true){
                        count.push(1);
                    }
                    else{
                        count.push(0);
                    }
                }
            }
            return count.every((el) => el === 1) ? true : false;

        case "rotate":
            for(let i = 0; i < currentFigure.type[currentFigure.rotate].length; i++){
                for(let j = 0; j < currentFigure.type[currentFigure.rotate][0].length; j++){
                    if(currentFigure.type[currentFigure.rotate][i][j] === 0) continue;
                    if(currentFigure.type[currentFigure.rotate][i][j] === 1 && gameField[i + currentFigure.y][j + currentFigure.x].stop !== true){
                        count.push(1);
                    }
                    else{
                        count.push(0);
                    }
                }
            }
            return count.every((el) => el === 1) ? true : false;

        default: return false;
    }
}

//checkin all rows

function checkFullRows(){
    console.log("check rows");
    let deletedRowsQty = 0;
    let deletedRows = [];
    for(let i = 0; i < fieldRows; i++){
        if(gameField[i].every(cell => cell.data === 1)){
            blockMove = true;
            deletedRowsQty += 1;
            deletedRows.push(i);
            deleteRow(gameField[i]);
        }
    }
    if(deletedRowsQty === 0){
        fullFieldUpdate();
    }
    else{
        scoreCount(deletedRowsQty);
        replaceRows(deletedRows);
    }
}

//account scores

function scoreCount(count){
    switch (count) {
        case 1:
            lines += 1;
            score += 100;
            linesField.innerText = lines.toString().padStart(6, "0");
            scoreField.innerText = score.toString().padStart(9, "0");
            break;
        case 2:
            lines += 2;
            score += 300;
            linesField.innerText = lines.toString().padStart(6, "0");
            scoreField.innerText = score.toString().padStart(9, "0");
            break;
        case 3:
            lines += 3;
            score += 600;
            linesField.innerText = lines.toString().padStart(6, "0");
            scoreField.innerText = score.toString().padStart(9, "0");
            break;
        case 4:
            lines += 4;
            score += 1000;
            linesField.innerText = lines.toString().padStart(6, "0");
            scoreField.innerText = score.toString().padStart(9, "0");
            break;
        default: return;
    }
}

//delete row

function deleteRow(row){
    console.log("delete row");
    
    row.forEach((cell) => {
            cell.stop = false;
            cell.classList.add("deleted");
    });
}

//replace row

function replaceRows(rows){
    setTimeout(() => {
        for(let i = 0; i < rows.length; i++){
            for(let j = 0; j < fieldRows; j++){
                if(j === rows[i]){
                    gameField.splice(j, 1);
                    gameField.unshift(createNewLine());
                    break;
                }
            }
        }
        console.log("replace rows");
        blockMove = false;
        fullFieldUpdate();
        
    }, 220);
}

//creating new line

function createNewLine(){
    let line = [];
    for(let i = 0; i < fieldCols; i++){
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.data = 0;
        cell.innerText = cell.data; //------
        line.push(cell);
    }
    return line;
}
