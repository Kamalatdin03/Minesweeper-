class Minesweeper {
    constructor(EL, options) {
        this.$EL = EL;
        this.onCell = options.onCell;
        this.onGameEnd = options.onGameEnd;
        this.view = new MinesweeperView(EL, options.flagCounterEL);
    }

    init() {
        this.$EL.addEventListener('touchstart', this.#mouseDownHandler.bind(this));
        this.$EL.addEventListener('touchend', this.#mouseUpHandler.bind(this));
        this.$EL.addEventListener('mousedown', this.#mouseDownHandler.bind(this));
        this.$EL.addEventListener('mouseup', this.#mouseUpHandler.bind(this));
    }

    newGame(options) {
        this.view.removeCells();
        this.rows = options.rows || 10;
        this.columns = options.columns || 10;
        this.mines = options.mines || 16;
        this.spacing = options.spacing;
        this.#createBoard();
        this.reset();
    }

    #getRandomIndex(x) {
        return Math.floor(Math.random() * (x - 1));
    }

    #indexInBound(x, y) {
        return x >= 0 && x < this.columns && y >= 0 && y < this.rows;
    }

    #createBoard() {
        this.board = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            this.board[i] = new Array(this.columns);
        }
        this.view.createBoard(this.rows, this.columns, this.spacing);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const cellView = new CellView(this.view.getElement(j, i));

                this.board[i][j] = new Cell(cellView, j, i);
            }
        }
    }

    #createMines() {
        for (let i = 0; i < this.mines; i++) {
            const x = this.#getRandomIndex(this.columns);
			const y = this.#getRandomIndex(this.rows);
			if (this.board[y][x].isMine){
				i--;
				continue;
			}
            this.board[y][x].isMine = true;
        }
    }

    #getNeighbors(cell) {
        const neighbors = [];
        const {
            x,
            y
        } = cell;

        for (let i = -1 + y; i <= 1 + y; i++) {
            for (let j = -1 + x; j <= 1 + x; j++) {
                if (i === y && j == x || !this.#indexInBound(j, i)) {
                    continue;
                }
                neighbors.push(this.board[i][j]);
            }
        }

        return neighbors;
    }

    #createNumbers() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const cell = this.board[i][j];
                if (cell.isMine) {
                    continue;
                }
                cell.mines = this.#getNeighbors(cell).filter(neighbor => neighbor.isMine).length;
            }
        }
    }

    #openCell(cell) {
        cell.open();
        if (cell.mines > 0) {
            return;
        } else if (cell.isMine) {
            this.#gameOver(GameEndNotification.PRESSED_ON_MINE);
            return;
        }
        this.#getNeighbors(cell).filter(a => !a.isOpened).forEach(neighbor => {
            this.#openCell(neighbor);
        });
    }

    #toggleFlag(cell) {
        if (cell.isOpened) {
            return;
        }

        cell.toggleFlag();
        this.flagCount += cell.isFlagged ? -1 : 1;
    }

    #mouseDownHandler(e) {
        if (this.isGameEnd) {
            return;
        }

        this.tapStart = Date.now();
    }

    #mouseUpHandler(e) {
        if (this.isGameEnd) {
            return;
        }
        const time = Date.now() - this.tapStart;

        let {
            x,
            y
        } = e.target.dataset;

        if (!x && !y) {
            x = e.target.parentNode.dataset.x;
            y = e.target.parentNode.dataset.y;
        }

        if (x && y) {
            const cell = this.board[y][x];

            this.#cellClicked(cell, time < 200 ? 'openCell' : 'toggleFlag');
        }

    }

    #cellClicked(cell, notificationType) {
        switch (notificationType) {
            case 'openCell':
                this.#openCell(cell);
                this.onCell(cell.isMine ? CellNotification.MINE_OPENED : CellNotification.CELL_OPENED);
                break;
            case 'toggleFlag':
                this.#toggleFlag(cell);
                this.onCell(CellNotification.FLAGGED);
                this.view.updateFlagCount(this.flagCount);

                if (this.#isWin()) {
                    this.#victory();
                } else {
                    if (this.flagCount <= 0) {
                        this.#gameOver(GameEndNotification.ENDED_FLAG);
                    }
                }
                break;
        }
    }

    #openAllCells() {
        this.isGameEnd = true;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const cell = this.board[i][j];
                if (cell.isFlagged && !cell.isMine) {
                    cell.drawCross();
                } else {
                    cell.open();
                }
            }
        }
    }

    #isWin() {
        for (let i = 0; i < this
            .rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (this.board[i][j].isMine && !this.board[i][j].isFlagged) {
                    return false;
                }
            }
        }

        return true;
    }

    #victory() {
        this.#openAllCells();
        this.onGameEnd(GameEndNotification.WIN);
    }

    #gameOver(type) {
        this.#openAllCells();
        this.onGameEnd(type);
    }

    #resetBoard() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this
                .columns; j++) {
                this.board[i][j].reset();
            }
        }
    }

    reset() {
        this.isGameEnd = false;
        this.#resetBoard();
        this.#createMines();
        this.#createNumbers();
        this.flagCount = Number(this.mines);
        this.view.updateFlagCount(this.flagCount);
    }
}