class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0
        };
        
        // Timer variables
        this.timer = null;
        this.timeLeft = 4;
        this.maxTime = 4;

        // Color theme variables
        this.colorThemes = ['theme-blue', 'theme-green', 'theme-orange', 'theme-purple', 'theme-dark'];
        this.currentThemeIndex = 0;
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        this.initializeGame();
    }

    initializeGame() {
        this.showSplashScreen();
        this.setupColorChanger();
        this.createBoard();
        this.updateStatus();
        this.setupEventListeners();
        this.updateScores();
    }

    showSplashScreen() {
        const splashScreen = document.getElementById('splashScreen');
        const mainContainer = document.getElementById('mainContainer');
        
        // Hide main container initially
        mainContainer.style.display = 'none';
        
        // Show splash screen for 3 seconds
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                mainContainer.style.display = 'block';
                this.startTimer(); // Start timer after splash
            }, 500);
        }, 3000);
    }

    setupColorChanger() {
        const colorChanger = document.getElementById('colorChanger');
        colorChanger.addEventListener('click', () => {
            this.changeBackgroundColor();
        });
    }

    changeBackgroundColor() {
        const body = document.body;
        
        // Remove current theme
        this.colorThemes.forEach(theme => {
            body.classList.remove(theme);
        });
        
        // Move to next theme
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.colorThemes.length;
        
        // Apply new theme
        body.classList.add(this.colorThemes[this.currentThemeIndex]);
        
        // Add click animation to emoji
        const colorChanger = document.getElementById('colorChanger');
        colorChanger.style.transform = 'scale(1.2) rotate(360deg)';
        setTimeout(() => {
            colorChanger.style.transform = '';
        }, 300);
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

        this.stopTimer();
        this.board[index] = this.currentPlayer;
        this.updateBoard();
        
        if (this.checkWinner()) {
            this.handleWin();
        } else if (this.board.every(cell => cell !== '')) {
            this.handleDraw();
        } else {
            this.switchPlayer();
            this.updateStatus();
            this.startTimer();
        }
    }

    startTimer() {
        this.timeLeft = this.maxTime;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.handleTimeOut();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    handleTimeOut() {
        this.stopTimer();
        
        if (this.gameActive) {
            this.switchPlayer();
            this.updateStatus();
            this.startTimer();
            
            const statusElement = document.getElementById('status');
            const originalText = statusElement.textContent;
            statusElement.textContent = `Time Out! ${this.currentPlayer}'s Turn`;
            statusElement.style.background = '#e74c3c';
            
            setTimeout(() => {
                this.updateStatus();
            }, 1000);
        }
    }

    updateTimerDisplay() {
        const timerProgress = document.getElementById('timerProgress');
        const timerText = document.getElementById('timerText');
        
        const percentage = (this.timeLeft / this.maxTime) * 100;
        timerProgress.style.width = `${percentage}%`;
        timerText.textContent = `${this.timeLeft}s`;
        
        if (this.timeLeft <= 1) {
            timerText.classList.add('timer-warning');
            timerProgress.style.background = '#e74c3c';
        } else if (this.timeLeft <= 2) {
            timerText.classList.remove('timer-warning');
            timerProgress.style.background = '#f1c40f';
        } else {
            timerText.classList.remove('timer-warning');
            timerProgress.style.background = '#2ecc71';
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
        this.stopTimer();
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
        this.stopTimer();
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
        this.stopTimer();
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('x', 'o', 'winning-cell');
        });
        
        this.createBoard();
        this.updateStatus();
        this.startTimer();
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
