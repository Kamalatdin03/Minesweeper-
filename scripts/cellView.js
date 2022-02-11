class CellView {
  constructor(EL) {
      this.$EL = EL;
  }

  #setInnerHTML(text) {
      this.$EL.innerHTML = text;
  }

  get isOpened() {
      return this.$EL.classList.contains('open');
  }

  open() {
      this.$EL.classList.add('open');
  }

  drawMine() {
      this.#setInnerHTML('<i class="fa-solid fa-bomb"></i>');
  }

  drawCross() {
      this.#setInnerHTML('<i class="fa-solid fa-xmark"></i>');
  }

  drawFlag(isFlagged) {
      if (isFlagged) {
          this.#setInnerHTML('<i class="fa-solid fa-flag"></i>');
      } else {
          this.reset();
      }
  }

  drawText(value) {
      this.#setInnerHTML(`<span>${value}</span>`);
  }

  reset() {
      this.#setInnerHTML('');
      if (this.isOpened) {
          this.$EL.classList.remove('open');
      }
  }
}