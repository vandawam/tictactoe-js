const Xbtn = document.getElementById('leaderboard');
const Game = document.getElementById('game');
const Turn = document.getElementById('turn')

function closel() {
    Xbtn.style.display = 'none';
}

function showl() {
    Xbtn.style.display = 'flex';
}

function playGame() {
    Game.classList.add('slide-left');
    Game.style.display = 'flex';
}

function backGame(){
    Game.style.display = 'none';
}



let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

const ROWS = 3;
const cs = canvas.height
const COLS = 3;
const CELL_SIZE = canvas.width / COLS;

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;

    for (let i = 1; i < ROWS; i++) {
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }

    for (let i = 1; i < COLS; i++) {
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
    }
}

function drawX(row, col) {
    ctx.beginPath();
    ctx.moveTo(col * CELL_SIZE + 10, row * CELL_SIZE + 10);
    ctx.lineTo((col + 1) * CELL_SIZE - 10, (row + 1) * CELL_SIZE - 10);
    ctx.moveTo((col + 1) * CELL_SIZE - 10, row * CELL_SIZE + 10);
    ctx.lineTo(col * CELL_SIZE + 10, (row + 1) * CELL_SIZE - 10);
    ctx.stroke();
}

function drawO(row, col) {
    ctx.beginPath();
    ctx.arc(col * CELL_SIZE + CELL_SIZE / 2, row * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 3, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawMove(row, col, player) {
    if (player === 'X') {
        drawX(row, col);
    } else {
        drawO(row, col);
    }
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (board[row][col] === '') {
        const currentPlayer = (board.flat().filter(x => x !== '').length % 2 === 0) ? 'X' : 'O';
        const Turns = (board.flat().filter(x => x !== '').length % 2 === 0) ? 'O' : 'X';
        board[row][col] = currentPlayer;
        drawMove(row, col, currentPlayer);
        checkGameStatus();
        Turn.textContent = `Player ${Turns} Turn`
    }
}

function checkWinner() {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const line of lines) {
        const [a, b, c] = line;
        const player = board[Math.floor(a / COLS)][a % COLS];
        if (player !== '' && player === board[Math.floor(b / COLS)][b % COLS] && player === board[Math.floor(c / COLS)][c % COLS]) {
            const xs = (a % COLS + 0.5) * CELL_SIZE;
            const ys = (Math.floor(a / COLS) + 0.5) * CELL_SIZE;
            const xa = (c % COLS + 0.5) * CELL_SIZE;
            const ya = (Math.floor(c / COLS) + 0.5) * CELL_SIZE;
            ctx.beginPath();
            ctx.lineWidth = 10
            ctx.strokeStyle = 'red'
            if (xs == xa) {
                ctx.moveTo(xs, 0 );
                ctx.lineTo(xa, cs );
            } else if (ys == ya) {
                ctx.moveTo(0, ys);
                ctx.lineTo(cs, ya);
            }
            ctx.stroke();
            return player;
        }
    }

    return null;
}

function checkGameStatus() {
    const winner = checkWinner();
    setTimeout(() => {
        if (winner !== null) {
            alert(`${winner} wins!`);
        } else if (board.flat().every(cell => cell !== '')) {
            alert("It's a tie!");
        }
    }, 100);
}

function restartGame() {
    // Reset board array to initial state
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    // Remove the old canvas element
    const oldCanvas = document.getElementById('canvas');
    const newCanvas = oldCanvas.cloneNode(true);
    oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);

    // Get the new canvas context
    canvas = newCanvas;
    ctx = canvas.getContext('2d');

    // Redraw the board on the new canvas
    drawBoard();

    // Reset the turn display
    Turn.textContent = `Player X Turn`;

    // Re-add event listener to the new canvas
    canvas.addEventListener('click', handleClick);
}

canvas.addEventListener('click', handleClick);
drawBoard();
