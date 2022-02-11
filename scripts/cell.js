class Cell {
  constructor(view, x, y) {
      this.x = x;
      this.y = y;
      this.view = view;
      this.reset();
  }

  get isOpened() {
      return this.view.isOpened;
  }

  open() {
      if (this.isFlagged) {
          return;
      }

      this.view.open();

      if (this.isMine) {
          this.view.drawMine();
      } else if (this.mines > 0) {
          this.view.drawText(this.mines);
      }
  }

  drawCross() {
      this.view.drawCross();
  }

  toggleFlag() {
      this.isFlagged = !this.isFlagged;
      this.view.drawFlag(this.isFlagged);
  }

  reset() {
      this.mines = 0;
      this.view.reset();
      this.isMine = false;
      this.isFlagged = false;
  }
}