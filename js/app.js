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

let flag, mine, mineCount, gameState, square

/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector('.board')
const squares = document.querySelectorAll('.squares')

/*----------------------------- Event Listeners -----------------------------*/



/*-------------------------------- Functions --------------------------------*/


init()

function init() {
    createBoard()
}

function createBoard() {
    for (let x = 1; x < 11; x++) {
        for (let y = 1; y < 11; y++) {
            square = document.createElement('div')
            board.appendChild(square)
            square.className = 'squares'
            square.setAttribute('row', x)
            square.setAttribute('column', y)
        }
    }
}


board.addEventListener('click', handleClick)
board.addEventListener('contextmenu', handleRightClick)

function handleClick(evt) {
    evt.preventDefault()
    console.log('left click')
    console.log(evt.target)
}

function handleRightClick(evt) {
    evt.preventDefault()
    console.log('right click')
}