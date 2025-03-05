const canvas = document.getElementById('board');
const context = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 20;

const colors = [
    null,
    'cyan',    // I
    'blue',    // J
    'orange',  // L
    'yellow',  // O
    'green',   // S
    'purple',  // T
    'red'      // Z
];

const pieces = [
    [],
    [[1, 1, 1, 1]], // I
    [[2, 0, 0], [2, 2, 2]], // J
    [[0, 0, 3], [3, 3, 3]], // L
    [[4, 4], [4, 4]], // O
    [[0, 5, 5], [5, 5, 0]], // S
    [[0, 6, 0], [6, 6, 6]], // T
    [[7, 7, 0], [0, 7, 7]]  // Z
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentPiece;
let currentPosition;
let score = 0;

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== 0) {
                context.fillStyle = colors[board[r][c]];
                context.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeStyle = '#000';
                context.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawPiece() {
    currentPiece.shape.forEach((row, r) => {
        row.forEach((value, c) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect((currentPosition.x + c) * BLOCK_SIZE, (currentPosition.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeStyle = '#000';
                context.strokeRect((currentPosition.x + c) * BLOCK_SIZE, (currentPosition.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function collide(offset) {
    return currentPiece.shape.some((row, r) => {
        return row.some((value, c) => {
            if (value !== 0) {
                const newX = currentPosition.x + c + offset.x;
                const newY = currentPosition.y + r + offset.y;
                return newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX] !== 0);
            }
            return false;
        });
    });
}

function merge() {
    currentPiece.shape.forEach((row, r) => {
