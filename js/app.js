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
const colorScheme = {
    dark: '',
    change: function() {
        colorScheme.dark = colorScheme.dark ? '' : 'dark'
        document.querySelector('body').setAttribute('class', colorScheme.dark)
    }
}


/*-------------------------------- Variables --------------------------------*/

let flagCount, mine, mineCount, gameState, square, row, column, isMined, clickedSquares, checked, neighbors, boardHeight, boardWidth, minesToPlace, size, mineChoice, jsFlag, boardSize

/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector('.board')
// const squares = document.querySelectorAll('.squares')
const cells = document.getElementsByClassName('squares')
const replayBtn = document.querySelector('#reset')
const flagCounter = document.querySelector('#flag-count')
const end = document.querySelector('#end-section')
const message = document.querySelector('#end-game-message')
const introLightDarkBtn = document.querySelector('#intro-light-dark-btn')
const gameLightDarkBtn = document.querySelector('#game-light-dark-btn')
const easy = document.querySelector('#easy')
const medium = document.querySelector('#medium')
const hard = document.querySelector('#hard')
const custom = document.querySelector('#custom')
const customOptions = document.querySelector('#custom-size-options')
const mineOptions = document.querySelector('#custom-mine-options')
const maxMines = document.querySelector('#max-mines')
const customText = document.querySelector('#custom-text')
const customMineText = document.querySelector('#custom-mine-text')
const sizeInput = document.querySelector('#size-input')
const mineInput = document.querySelector('#mine-input')
const customBtn = document.querySelector('#custom-submit-btn')
const mineBtn = document.querySelector('#custom-mine-submit-btn')
const failedInput = document.querySelector('#failed-input')
const failedMineInput = document.querySelector('#failed-mine-input')
const intro = document.querySelector('#intro')
const game = document.querySelector('#game')
const flagSymbol = document.querySelector('#flag-symbol')
const body = document.querySelector('#entire-body')



/*----------------------------- Event Listeners -----------------------------*/

replayBtn.addEventListener('click', function() {
    document.location.reload(true)
})
introLightDarkBtn.addEventListener('click', colorScheme.change)
gameLightDarkBtn.addEventListener('click', colorScheme.change)
easy.addEventListener('click', handleEasy)
medium.addEventListener('click', handleMedium)
hard.addEventListener('click', handleHard)
custom.addEventListener('click', handleCustom)
customBtn.addEventListener('click', handleCustomOptions)
mineBtn.addEventListener('click', handleCustomMineOptions)

/*-------------------------------- Functions --------------------------------*/


function handleEasy() {
    boardHeight = 9
    boardWidth = 9
    minesToPlace = 10
    intro.setAttribute('hidden', true)
    game.removeAttribute('hidden')
    createBoard() 
}

function handleMedium() {
    boardHeight = 16
    boardWidth = 16
    minesToPlace = 40
    intro.setAttribute('hidden', true)
    game.removeAttribute('hidden')
    createBoard() 
}

function handleHard() {
    boardHeight = 22
    boardWidth = 22
    minesToPlace = 99
    intro.setAttribute('hidden', true)
    game.removeAttribute('hidden')
    createBoard() 
}

function handleCustom() {
    customOptions.removeAttribute('hidden')
}

function handleCustomOptions() {
    size = parseInt(sizeInput.value)
    if (isNaN(size) || size < 5 || size > 30) {
        sizeInput.value = ''
        customText.setAttribute('hidden', true)
        failedInput.innerText = 'Please choose a number between 5 and 30'
    }
    else {
        customOptions.setAttribute('hidden', true)
        mineOptions.removeAttribute('hidden')
        maxMines.innerText = `${Math.floor((size * size) / 1.5)}`
    }
}

function handleCustomMineOptions() {
    mineChoice = parseInt(mineInput.value)
    console.log(mineChoice)
    if (isNaN(mineChoice) || mineChoice < 1 || mineChoice > maxMines.innerText) {
        mineInput.value = ''
        customMineText.setAttribute('hidden', true)
        failedMineInput.innerText = `Please choose a number between 1 and ${maxMines.innerText}`
    }
    else {
        boardHeight = size
        boardWidth = size
        minesToPlace = mineChoice
        intro.setAttribute('hidden', true)
        game.removeAttribute('hidden')
        createBoard() 
    }
}


//initiates the game
function init() {
    gameState = 'playing'
    end.setAttribute('hidden', true)
    message.innerText = ''
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = ''
        cells[i].setAttribute('data-mine', 0)
    }
    boardSize = boardWidth * boardHeight
    mineCount = 0
    flagCount = 0
    clickedSquares = 0
    jsFlag = `${flagSymbol.innerText}`
    checked = []
    placeMines()
    winCount = cells.length - mineCount
    giveCellsNeighborValues()
    flagCounter.innerHTML = mineCount - flagCount
    if (body.style.backgroundColor == 'url(../images/inline_image_preview.jpeg)') console.log('yes')
}


//make a 10X10 board and set the row and column number for each square
function createBoard() {
    for (let x = 1; x < boardWidth + 1; x++) {
        for (let y = 1; y < boardHeight + 1; y++) {
            square = document.createElement('div')
            board.appendChild(square)
            square.className = 'squares'
            square.setAttribute('data-row', x)
            square.setAttribute('data-column', y)
            square.setAttribute('data-mine', 0)
            square.setAttribute('data-nearby-mine-cells', 0)
        }
    }
    board.style.gridTemplateRows = `repeat(${boardHeight}, ${65 / boardHeight}vmin)`
    board.style.gridTemplateColumns = `repeat(${boardWidth}, ${65 / boardHeight}vmin)`
    board.style.fontSize = `${50 / boardWidth}vmin`
    init()
}


board.addEventListener('click', handleClick)
board.addEventListener('contextmenu', handleRightClick)


//handle a left click
function handleClick(evt) {
    if (gameState !== 'playing' || evt.target.innerText == jsFlag || checked.includes(evt.target)) return
    row = evt.target.getAttribute('data-row')
    column = evt.target.getAttribute('data-column')
    mine = evt.target.getAttribute('data-mine')
    neighborMines = evt.target.getAttribute('data-nearby-mine-cells')
    if (mine == 1) {
        evt.target.style.backgroundColor = 'red'
        gameOver()
    }
    else if (neighborMines == 0) {
        bubbleSquares = bubble(evt.target)
        bubbleSquares.forEach(function(bubbleSquare) {
            setNumber(bubbleSquare)
        })
    }
    else {
        if (!checked.includes(evt.target)) checked.push(evt.target)
        setNumber(evt.target)
    }
    checkForWinner()
}

//handle a left click and place a flag
function handleRightClick(evt) {
    evt.preventDefault()
    if (checked.includes(evt.target)) return
    if (gameState !== 'playing') return
    if (evt.target.innerText != jsFlag) {
        evt.target.innerText = jsFlag
        if (boardSize >=150) {
            evt.target.style.fontSize = '1.5vmin'
        }
        flagCount++
        
    }
    else if (evt.target.innerText == jsFlag){
        evt.target.innerText = ''
        evt.target.style.fontSize = 'inherit'
        flagCount--
    }
    flagCounter.innerHTML = mineCount - flagCount
}

//places 15 mines in random cells
function placeMines() {
    while (mineCount < minesToPlace) {
        let rngRow = Math.floor(Math.random() * boardHeight) + 1;
        let rngColumn = Math.floor(Math.random() * boardWidth) + 1;
        for (let i = 0; i < cells.length; i++) {
            row = cells[i].getAttribute('data-row')
            column = cells[i].getAttribute('data-column')
            isMined = cells[i].getAttribute('data-mine')
            if(row == rngRow && column == rngColumn && isMined == 0) {
                cells[i].setAttribute('data-mine', 1)
                // cells[i].innerText = '💣' /*---for testing purposes to see the mines*/
                mineCount++
                break
            }
        }
    }
}

function giveCellsNeighborValues() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute('data-nearby-mine-cells', countMines(cells[i]))
    }
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
        if (cellColumn != boardWidth) {
            const topRightCell = document.querySelector(`[data-row='${cellRow-1}'][data-column='${cellColumn+1}']`)
            if (topRightCell.getAttribute('data-mine') == 1) nearbyMines++
        }
    }
    if (cellColumn != 1) {
        const leftCell = document.querySelector(`[data-row='${cellRow}'][data-column='${cellColumn-1}']`)
        if (leftCell.getAttribute('data-mine') == 1) nearbyMines++
    }
    if (cellColumn != boardWidth) {
        const lightCell = document.querySelector(`[data-row='${cellRow}'][data-column='${cellColumn+1}']`)
        if (lightCell.getAttribute('data-mine') == 1) nearbyMines++
    }
    if (cellRow != boardHeight) {
        if (cellColumn != 1) {
            const bottomLeftCell = document.querySelector(`[data-row='${cellRow+1}'][data-column='${cellColumn-1}']`)
            if (bottomLeftCell.getAttribute('data-mine') == 1) nearbyMines++
        }
        const bottomMiddleCell = document.querySelector(`[data-row='${cellRow+1}'][data-column='${cellColumn}']`)
        if (bottomMiddleCell.getAttribute('data-mine') == 1) nearbyMines++
        if (cellColumn != boardWidth) {
            const bottomRightCell = document.querySelector(`[data-row='${cellRow+1}'][data-column='${cellColumn+1}']`)
            if (bottomRightCell.getAttribute('data-mine') == 1) nearbyMines++
        }
    }
    return nearbyMines
}


function setNumber(cell) {
    let surroundingMines = cell.getAttribute('data-nearby-mine-cells')
    cell.innerText = surroundingMines
    cell.style.backgroundColor = 'gray'
    if (surroundingMines == 0) cell.style.fontSize = '0'
    if (surroundingMines == 1) cell.style.color = 'blue'
    if (surroundingMines == 2) cell.style.color = 'green'
    if (surroundingMines == 3) cell.style.color = 'red'
    if (surroundingMines == 4) cell.style.color = 'purple'
    if (surroundingMines == 5) cell.style.color = 'maroon'
    if (surroundingMines == 6) cell.style.color = 'turquoise'
    if (surroundingMines == 7) cell.style.color = 'black'
    if (surroundingMines == 8) cell.style.color = 'darkgray'
}



function bubble(cell) {
    if (checked.includes(cell)) return []
    checked.push(cell)
    let bubbleSquares = []
    setNumber(cell)
    neighbors = getNeighbors(cell)
    neighbors.forEach(function(neighbor) {
        if (neighbor.getAttribute('data-mine') == 0 && neighbor.innerText != jsFlag) {
            if (!checked.includes(neighbor)) {
                bubbleSquares.push(neighbor)
            }
            if (neighbor.getAttribute('data-nearby-mine-cells') == 0) {
                bubbleSquares = bubbleSquares.concat(bubble(neighbor))
            }
        }

    })
    return bubbleSquares
}

function getNeighbors(cell) {
    let neighborCells = []
    let cellRow = parseInt(cell.getAttribute('data-row'))
    let cellColumn = parseInt(cell.getAttribute('data-column'))
    if (cellRow !== 1) {
        if (cellColumn != 1) {
            const topLeftCell = document.querySelector(`[data-row='${cellRow-1}'][data-column='${cellColumn-1}']`)
            neighborCells.push(topLeftCell)
        }
        const topMiddleCell = document.querySelector(`[data-row='${cellRow-1}'][data-column='${cellColumn}']`)
        neighborCells.push(topMiddleCell)
        if (cellColumn != boardWidth) {
            const topRightCell = document.querySelector(`[data-row='${cellRow-1}'][data-column='${cellColumn+1}']`)
            neighborCells.push(topRightCell)
        }
    }
    if (cellColumn != 1) {
        const leftCell = document.querySelector(`[data-row='${cellRow}'][data-column='${cellColumn-1}']`)
        neighborCells.push(leftCell)
    }
    if (cellColumn != boardWidth) {
        const rightCell = document.querySelector(`[data-row='${cellRow}'][data-column='${cellColumn+1}']`)
        neighborCells.push(rightCell)
    }
    if (cellRow != boardHeight) {
        if (cellColumn != 1) {
            const bottomLeftCell = document.querySelector(`[data-row='${cellRow+1}'][data-column='${cellColumn-1}']`)
            neighborCells.push(bottomLeftCell)
        }
        const bottomMiddleCell = document.querySelector(`[data-row='${cellRow+1}'][data-column='${cellColumn}']`)
        neighborCells.push(bottomMiddleCell)
        if (cellColumn != boardWidth) {
            const bottomRightCell = document.querySelector(`[data-row='${cellRow+1}'][data-column='${cellColumn+1}']`)
            neighborCells.push(bottomRightCell)
        }
    }
    return neighborCells
}


function gameOver() {
    gameState = 'Lost'
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].getAttribute('data-mine') == 1 && cells[i].innerText != jsFlag) {
            cells[i].innerText = '💣'
        }
        if(cells[i].getAttribute('data-mine') != 1 && cells[i].innerText == jsFlag) {
            cells[i].innerText = 'X'
        }
    }
    end.removeAttribute('hidden')
    message.innerText = 'Oh no! You hit a mine!'
}

function checkForWinner() {
    let grayCount = 0
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].style.backgroundColor === 'gray') grayCount++
    }
    if (grayCount == winCount) {
        winner()
    }
}


function winner() {
    gameState = 'Won'
    end.removeAttribute('hidden')
    message.innerText = 'Congratulations! You win!'
}


