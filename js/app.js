/* Minesweeper Pseudocode

define variables to track the game (flag, mine, mineCount, gameState)

store cached elements
create buttons for difficulty and reset


Page features:
game board grid
difficulty buttons
game reset button
remaining mine counter (goes down when placing a flag)
timer going up
(optional) button to place flags with left click



Gameplay:
Ask user for diffuclty (easy, medium, hard)
generate board with size based on difficulty
(optional) add custom game size and/or custom mine number
randomly place mines (number based on difficulty)

user can left click to open square
user can right click to put a flag on square
if square is clicked, check if it has a mine

if there is a mine, render a game over, let user restart

gameOver()
show all remaining mines
show crossed-out mines where flags were incorrectly placed
change gameState to loss
allow no more clicks

if no mine, check adjacent squares for mines and add to mineCount
then show minecount on clicked square

if no nearby mines, open all other squares with a mineCount of 0 that directly connect to this square
and show the minecount on all surrounding squares

if all non-mine squares are open render a win

win()
fill remaining unopened mine squares with flags
render win message
give option to play again
(optional) giv eoption of same difficulty vs full reset to difficulty choice
tell score
(optional) confetti or some other victory celebration
(optional add score to high score board)


(optional) make high score board
*/


/*-------------------------------- Constants --------------------------------*/



/*-------------------------------- Variables --------------------------------*/

let flag, mine, mineCount, gameState, square, row, column, isMined, nearbyMines

/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector('.board')
const squares = document.querySelectorAll('.squares')
const cells = document.getElementsByClassName('squares')
const replayBtn = document.querySelector('#reset')

/*----------------------------- Event Listeners -----------------------------*/

replayBtn.addEventListener('click', init)

/*-------------------------------- Functions --------------------------------*/


createBoard() 
//creates the blank game boad once when loading the page


//initiates the game
function init() {
    gameState = 'playing'
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = ''
        cells[i].setAttribute('mine', 0)
        cells[i].style.backgroundColor = 'lightgray'
        cells[i].style.color = 'black'
    }
    mineCount = 0
    placeMines()
}


//make a 10X10 board and set the row and column number for each square
function createBoard() {
    for (let x = 1; x < 11; x++) {
        for (let y = 1; y < 11; y++) {
            square = document.createElement('div')
            board.appendChild(square)
            square.className = 'squares'
            square.setAttribute('row', x)
            square.setAttribute('column', y)
            square.setAttribute('mine', 0)
            // row = square.getAttribute('row')
            // console.log(row)
            // console.log(square.getAttribute('mine'))
        }
    }
    init()
}


board.addEventListener('click', handleClick)
board.addEventListener('contextmenu', handleRightClick)


//handle a left click
function handleClick(evt) {
    evt.preventDefault()
    nearbyMines = 0
    if (gameState !== 'playing' || evt.target.innerText === 'F' || evt.target.style.backgroundColor === 'gray') return
    row = evt.target.getAttribute('row')
    column = evt.target.getAttribute('column')
    mine = evt.target.getAttribute('mine')
    evt.target.style.backgroundColor = 'gray'
    if (mine == 1) {
        evt.target.style.backgroundColor = 'red'
        gameOver()
    }
    else {
        countMines(row - 1, column - 1)
        setNumber(evt)
    }
}

//handle a left click and place a flag
function handleRightClick(evt) {
    evt.preventDefault()
    if (gameState !== 'playing') return
    if (evt.target.innerText !== 'F') {
        evt.target.innerText = 'F'
    }
    else if (evt.target.innerText === 'F'){
        evt.target.innerText = ''
    }
}

//places 15 mines in random cells
function placeMines() {
    while (mineCount < 50) {
        let rngRow = Math.floor(Math.random() * 10) + 1;
        let rngColumn = Math.floor(Math.random() * 10) + 1;
        for (let i = 0; i < cells.length; i++) {
            row = cells[i].getAttribute('row')
            column = cells[i].getAttribute('column')
            isMined = cells[i].getAttribute('mine')
            if(row == rngRow && column == rngColumn && isMined == 0) {
                cells[i].setAttribute('mine', 1)
                cells[i].innerText = 'M'
                mineCount++
                break
            }
        }
}
}

function gameOver() {
    gameState = 'Lost'
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].getAttribute('mine') == 1 && cells[i].innerText !== 'F') {
            cells[i].innerText = 'M'
        }
        if(cells[i].getAttribute('mine') != 1 && cells[i].innerText === 'F') {
            cells[i].innerText = 'X'
        }
    }
    console.log(gameState)
}

function countMines(newRow, newColumn) {
    nearbyMines
    let cellRow
    let cellColumn
    if (newRow != row || newColumn != column) {
        for (let i = 0; i < cells.length; i++) {
            cellRow = cells[i].getAttribute('row')
            cellColumn = cells[i].getAttribute('column')
            cellMine = cells[i].getAttribute('mine')
            if (cellRow == newRow && cellColumn == newColumn){
                if (cellMine == 1) {
                    console.log('we found a mine', cellRow, cellColumn)
                    nearbyMines++
                }
            }
        }
    }
    if (newRow < parseInt(row) + 1) {
        countMines(newRow+1, newColumn)
    }
    else if(newRow >= parseInt(row) + 1 && newColumn < parseInt(column) + 1) {
        countMines(row - 1, newColumn + 1)
    }
}

function setNumber(evt) {
    evt.target.innerText = nearbyMines
    if (nearbyMines === 1) evt.target.style.color = 'blue'
    if (nearbyMines === 2) evt.target.style.color = 'green'
    if (nearbyMines === 3) evt.target.style.color = 'red'
    if (nearbyMines === 4) evt.target.style.color = 'purple'
    if (nearbyMines === 5) evt.target.style.color = 'maroon'
    if (nearbyMines === 6) evt.target.style.color = 'turquoise'
    if (nearbyMines === 7) evt.target.style.color = 'black'
    if (nearbyMines === 8) evt.target.style.color = 'darkgray'
}