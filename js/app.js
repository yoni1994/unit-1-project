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

let flagCount, mine, mineCount, gameState, square, row, column, isMined, haveBubbled, nearbyCells, newBubbleRow, newBubbleColumn

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
        cells[i].setAttribute('data-mine', 0)
        cells[i].style.backgroundColor = 'lightgray'
        cells[i].style.color = 'black'
    }
    mineCount = 0
    flagCount = 0
    placeMines()
    giveCellsNeighborValues()
}


//make a 10X10 board and set the row and column number for each square
function createBoard() {
    for (let x = 1; x < 11; x++) {
        for (let y = 1; y < 11; y++) {
            square = document.createElement('div')
            board.appendChild(square)
            square.className = 'squares'
            square.setAttribute('data-row', x)
            square.setAttribute('data-column', y)
            square.setAttribute('data-mine', 0)
            square.setAttribute('data-nearby-mine-cells', 0)
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
    nearbyCells = []
    haveBubbled = 0
    if (gameState !== 'playing' || evt.target.innerText === 'F' || evt.target.style.backgroundColor === 'gray') return
    row = evt.target.getAttribute('data-row')
    column = evt.target.getAttribute('data-column')
    mine = evt.target.getAttribute('data-mine')
    evt.target.style.backgroundColor = 'gray'
    if (mine == 1) {
        evt.target.style.backgroundColor = 'red'
        gameOver()
    }
    else {
        setNumber(evt)
    }
}

//handle a left click and place a flag
function handleRightClick(evt) {
    evt.preventDefault()
    if (gameState !== 'playing') return
    if (evt.target.innerText !== 'F') {
        evt.target.innerText = 'F'
        flagCount++
    }
    else if (evt.target.innerText === 'F'){
        evt.target.innerText = ''
        flagCount--
    }
}

//places 15 mines in random cells
function placeMines() {
    while (mineCount < 15) {
        let rngRow = Math.floor(Math.random() * 10) + 1;
        let rngColumn = Math.floor(Math.random() * 10) + 1;
        for (let i = 0; i < cells.length; i++) {
            row = cells[i].getAttribute('data-row')
            column = cells[i].getAttribute('data-column')
            isMined = cells[i].getAttribute('data-mine')
            if(row == rngRow && column == rngColumn && isMined == 0) {
                cells[i].setAttribute('data-mine', 1)
                cells[i].innerText = 'M' /*---for testing purposes to see the mines*/
                mineCount++
                break
            }
        }
}
}

function gameOver() {
    gameState = 'Lost'
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].getAttribute('data-mine') == 1 && cells[i].innerText !== 'F') {
            cells[i].innerText = 'M'
        }
        if(cells[i].getAttribute('data-mine') != 1 && cells[i].innerText === 'F') {
            cells[i].innerText = 'X'
        }
    }
    console.log(gameState)
}

function countMines(cell) {
    let nearbyMines = 0
    let cellRow = parseInt(cell.getAttribute('data-row'))
    let cellColumn = parseInt(cell.getAttribute('data-column'))
    let cellMine = parseInt(cell.getAttribute('data-mine'))
    if (cellRow !== 1) {
        if (cellColumn != 1) {
            const topLeftCell = document.querySelector(`[data-row='${cellRow-1}'][data-column='${cellColumn-1}']`)
            if (topLeftCell.getAttribute('data-mine') == 1) nearbyMines++
        }
        const topMiddleCell = document.querySelector(`[data-row='${cellRow-1}'][data-column='${cellColumn}']`)
        if (topMiddleCell.getAttribute('data-mine') == 1) nearbyMines++
        if (cellColumn != 10) {
            const topRightCell = document.querySelector(`[data-row='${cellRow-1}'][data-column='${cellColumn+1}']`)
            if (topRightCell.getAttribute('data-mine') == 1) nearbyMines++
        }
    }
    if (cellColumn != 1) {
        const LeftCell = document.querySelector(`[data-row='${cellRow-1}'][data-column='${cellColumn+1}']`)
        if (LeftCell.getAttribute('data-mine') == 1) nearbyMines++
    }
    if (cellColumn != 10) {

    }
    if (cellRow !== 10) {
        if (cellColumn != 1) {

        }
        if (cellColumn != 10) {

        }
    }

    // for (let i = 0; i < cells.length; i++) {
    //     newCellRow = cells[i].getAttribute('data-row')
    //     newCellColumn = cells[i].getAttribute('data-column')
    //     newCellMine = cells[i].getAttribute('data-mine')
    //     if (cellRow == newCellRow && cellColumn == newCellColumn){
    //         if (cellMine == 1) {
    //             nearbyMines++
    //         }
    //     }
    // }
    // if (newCellRow < parseInt(row) + 1) {
    //     countMines(newCellRow+1, newCellColumn)
    // }
    // else if(newCellRow >= parseInt(row) + 1 && newCellColumn < parseInt(column) + 1) {
    //     countMines(cellRow - 1, newCellColumn + 1)
    // }
    return nearbyMines
}



    // let cellRow
    // let cellColumn
    // if (newRow != row || newColumn != column) {
    //     for (let i = 0; i < cells.length; i++) {
    //         cellRow = cells[i].getAttribute('data-row')
    //         cellColumn = cells[i].getAttribute('data-column')
    //         cellMine = cells[i].getAttribute('data-mine')
    //         if (cellRow == newRow && cellColumn == newColumn){
    //             nearbyCells.push(cells[i])
    //             if (cellMine == 1) {
    //                 nearbyMines++
    //             }
    //         }
    //     }
    // }
    // if (newRow < parseInt(row) + 1) {
    //     countMines(newRow+1, newColumn)
    // }
    // else if(newRow >= parseInt(row) + 1 && newColumn < parseInt(column) + 1) {
    //     countMines(row - 1, newColumn + 1)
    // }
    // if (nearbyMines === 0) {
    //     let bubbleArray = bubble(row, column, [])
    //     doBubble(bubbleArray)
    // }
    // if (nearbyMines === 0) {
    //     if (haveBubbled === 0) {
    //         newBubbleRow = parseInt(row)+1
    //         newBubbleColumn = parseInt(column)
    //     }
    //     else if (haveBubbled === 1 && row < 10){
    //         newBubbleRow++
    //     }
    //     console.log(newBubbleRow, newBubbleColumn)
    //     if(newBubbleRow <= 10 && newBubbleColumn <= 10) {
    //         bubble(newBubbleRow, newBubbleColumn)
    //     }
    // }


function setNumber(evt) {
    console.log(nearbyMines)
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

function bubble(bubbleRow, bubbleColumn) {
    haveBubbled = 1
    // setNumber(evt)
    newBubbleRow = bubbleRow
    newBubbleColumn = bubbleColumn
        countMines(bubbleRow, bubbleColumn)
    
}

// function bubble(bubbleRow, bubbleColumn, checked) {
//     let bubbleSquares = []

//     for (let i = 0; i < cells.length; i++) {
//         let bubbleCellRow = cells[i].getAttribute('data-row')
//         let bubbleCellColumn = cells[i].getAttribute('data-column')
//         let bubbleCellMine = cells[i].getAttribute('data-mine')
//         if (bubbleCellRow == bubbleRow && bubbleCellColumn == bubbleColumn) {
//             if (checked.includes(cells[i])) return []
//             checked.push(cells[i])
//         }
//     }
//     nearbyCells.forEach(function(nearbyCell) {
//         let nearbyCellRow = nearbyCell.getAttribute('data-row')
//         let nearbyCellColumn = nearbyCell.getAttribute('data-column')
//         let nearbyCellMine = nearbyCell.getAttribute('data-mine')
//         if (nearbyCellMine == 0 && nearbyCell.innerText !== 'F') {
//             if (!checked.includes(nearbyCell)) {
//                 bubbleSquares.push(nearbyCell)
//             }
//             if (nearbyCellMine == 0) {
//                 bubbleSquares = bubbleSquares.concat(bubble(nearbyCellRow, nearbyCellColumn, checked))
//             }
//         }
//     })
//     return (bubbleSquares)
// }


// function doBubble(bubbleCells) {
//     bubbleCells.forEach(function(bubbleCell) {
//         let bubbleCellRow = bubbleCell.getAttribute('data-row')
//         let bubbleCellColumn = bubbleCell.getAttribute('data-column')
//         let bubbleCellMine = bubbleCell.getAttribute('data-mine')
//         bubbleCell.style.backgroundColor = 'gray'
//         bubble(bubbleCellRow, bubbleCellColumn, [])
//     })
// }


function giveCellsNeighborValues() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute('data-nearby-mine-cells', countMines(cells[i]))
    }
}
