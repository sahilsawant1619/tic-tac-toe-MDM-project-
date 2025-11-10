class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0
        };
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        this.initializeGame();
    }

    initializeGame() {
        this.createBoard();
        this.updateStatus();
        this.setupEventListeners();
        this.updateScores();
    }

    createBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        this.board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            cellElement.setAttribute('data-index', index);
            cellElement.addEventListener('click', () => this.handleCellClick(index));
            boardElement.appendChild(cellElement);
        });
    }

    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '') return;

        this.board[index] = this.currentPlayer;
        this.updateBoard();
        
        if (this.checkWinner()) {
            this.handleWin();
        } else if (this.board.every(cell => cell !== '')) {
            this.handleDraw();
        } else {
            this.switchPlayer();
            this.updateStatus();
        }
    }

    updateBoard() {
        this.board.forEach((value, index) => {
            const cellElement = document.querySelector(`[data-index="${index}"]`);
            cellElement.textContent = value;
            if (value) {
                cellElement.classList.add(value.toLowerCase());
            }
        });
    }

    checkWinner() {
        return this.winningConditions.some(condition => {
            const [a, b, c] = condition;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }

    getWinningCells() {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                return condition;
            }
        }
        return [];
    }

    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        
        const winningCells = this.getWinningCells();
        winningCells.forEach(index => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            cell.classList.add('winning-cell');
        });
        
        document.getElementById('status').textContent = `🎉 Player ${this.currentPlayer} Wins!`;
        document.getElementById('status').style.background = this.currentPlayer === 'X' ? '#e74c3c' : '#3498db';
    }

    handleDraw() {
        this.gameActive = false;
        document.getElementById('status').textContent = "Game Draw! 🤝";
        document.getElementById('status').style.background = '#7f8c8d';
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    updateStatus() {
        const statusElement = document.getElementById('status');
        statusElement.textContent = `Player ${this.currentPlayer}'s Turn`;
        statusElement.style.background = '#34495e';
    }

    updateScores() {
        document.getElementById('scoreX').textContent = this.scores.X;
        document.getElementById('scoreO').textContent = this.scores.O;
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('x', 'o', 'winning-cell');
        });
        
        this.createBoard();
        this.updateStatus();
    }

    resetScores() {
        this.scores = { X: 0, O: 0 };
        this.updateScores();
        this.resetGame();
    }

    setupEventListeners() {
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('resetScoreBtn').addEventListener('click', () => this.resetScores());
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});