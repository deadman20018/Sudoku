interface SudokuGrid {
    [row: number]: number[];
}

function getRandomNumber(): number {
    return Math.floor(Math.random() * 9) + 1;
}

function isValid(grid: SudokuGrid, row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) {
            return false;
        }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (grid[i][j] === num) {
                return false;
            }
        }
    }

    return true;
}

function generateRandomValues(grid: SudokuGrid, count: number): void {
    let attempts = 0;
    while (count > 0 && attempts < 100) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        const num = getRandomNumber();
        if (grid[row][col] === 0 && isValid(grid, row, col, num)) {
            grid[row][col] = num;
            count--;
        }
        attempts++;
    }
}

function generateValidGrid(difficulty: string): void {
    const gridContainer = document.getElementById('sudoku-grid') as HTMLDivElement;
    let grid: SudokuGrid = {};
    for (let i = 0; i < 9; i++) {
        grid[i] = [];
        for (let j = 0; j < 9; j++) {
            grid[i][j] = 0;
        }
    }

    let wrongAttempts: number = 0;
    const maxTries: number = 3;

    function solveSudoku(row: number, col: number): boolean {
        if (row === 9) {
            return true;
        }

        let nextRow: number = col === 8 ? row + 1 : row;
        let nextCol: number = col === 8 ? 0 : col + 1;

        if (grid[row][col] !== 0) {
            return solveSudoku(nextRow, nextCol);
        }

        for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
                grid[row][col] = num;
                if (solveSudoku(nextRow, nextCol)) {
                    return true;
                }
                grid[row][col] = 0;
            }
        }

        return false;
    }

    function removeValues(difficulty: string): void {
        let removeCount: number;
        switch (difficulty) {
            case 'debug':
                removeCount = 2;
                break;
            case 'easy':
                removeCount = 40;
                break;
            case 'medium':
                removeCount = 50;
                break;
            case 'hard':
                removeCount = 60;
                break;
            case 'complete':
                removeCount = 0;
                break;
            default:
                removeCount = 40;
        }

        for (let i = 0; i < removeCount; i++) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (grid[row][col] !== 0) {
                grid[row][col] = 0;
            } else {
                i--;
            }
        }
    }

    generateRandomValues(grid, 10); 
    solveSudoku(0, 0);
    removeValues(difficulty);

    function displayGrid(): void {
        gridContainer.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.textContent = grid[i][j] !== 0 ? grid[i][j].toString() : '';
                if (grid[i][j] !== 0) {
                    cell.classList.add('readonly');
                } else {
                    cell.contentEditable = 'true';
                    cell.addEventListener('input', function() {
                        const input = parseInt(cell.textContent || '0', 10);
                        if (isNaN(input) || input < 1 || input > 9 || !isValid(grid, i, j, input)) {
                            cell.textContent = '';
                            wrongAttempts++;
                            const remainingTries = maxTries - wrongAttempts;
                            if (remainingTries <= 0) {
                                solveSudoku(0, 0); 
                                alert('You made more than ' + maxTries + ' mistakes. You lose!');
                                displayGrid(); 
                            } else {
                                alert('Wrong number! Try again. Tries left: ' + remainingTries);
                            }
                        } else {
                            grid[i][j] = input;
                            if (checkWin(grid)) {
                                alert('Congratulations! You won!');
                            }
                        }
                    });
                }
                gridContainer.appendChild(cell);
            }
        }
    }

    displayGrid();
}

function checkWin(grid: SudokuGrid): boolean {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

function startGame(difficulty: string): void {
    generateValidGrid(difficulty);
}

document.getElementById('easy-btn')?.addEventListener('click', function() {
    startGame('easy');
});

document.getElementById('medium-btn')?.addEventListener('click', function() {
    startGame('medium');
});

document.getElementById('hard-btn')?.addEventListener('click', function() {
    startGame('hard');
});

document.getElementById('debug-btn')?.addEventListener('click', function() {
    startGame('debug');
});

document.getElementById('complete-btn')?.addEventListener('click', function() {
    startGame('complete');
});
