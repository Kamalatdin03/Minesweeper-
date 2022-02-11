class MinesweeperView {
    constructor(EL, flagCounterEL) {
        this.$EL = EL;
        this.$flagCounterEL = flagCounterEL;
        EL.style.height = EL.offsetWidth + 'px';
    }

    #textFormat(value, length) {
        value = value.toString();
        let text = '';
        for (let i = 0; i < length - value.length; i++) {
            text += '0';
        }
        return text + value;
    }

    getElement(x, y) {
        return this.board[y][x];
    }

    createBoard(rows, columns, spacing) {
        const tileSize = (this.$EL.getBoundingClientRect().width - spacing * (columns - 1)) / columns;
        this.board = new Array(rows);
        for (let i = 0; i < columns; i++) {
            this.board[i] = new Array(columns);
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('data-x', j);
                cell.setAttribute('data-y', i);
                cell.style.width = tileSize + 'px';
                cell.style.height = tileSize + 'px';
                cell.style.top = i * (tileSize + spacing) + 'px';
                cell.style.left = j * (tileSize + spacing) + 'px';
                this.board[i][j] = cell;
                this.$EL.appendChild(cell);
            }
        }
    }

    removeCells() {
        while (this.$EL.children.length > 0) {
            this.$EL.children[0].remove();
        }
    }

    updateFlagCount(count) {
        this.$flagCounterEL.innerHTML = this.#textFormat(count, 3);
    }
}