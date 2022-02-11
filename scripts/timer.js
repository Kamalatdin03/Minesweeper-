class Timer {
    constructor(EL, perTickTime) {
        this.$EL = EL;
        this.perTickTime = perTickTime;
        this.reset();
    }

    #textFormat(num, digits) {
        num = num.toString();
        let text = '';
        for (let i = 0; i < digits - num.length; i++) {
            text += '0';
        }
        return text + num;
    }

    #updateText() {
        this.$EL.innerHTML = this.getTime();
    }

    #tick() {
        this.time += this.perTickTime;
        this.#updateText();
    }

    start() {
        this.interval = setInterval(this.#tick.bind(this), this.perTickTime);
    }

    stop() {
        clearInterval(this.interval);
    }

    getTime() {
        const m = Math.floor(this.time / 1000 / 60);
        const s = Math.floor(this.time / 1000 % 60);
        return `${this.#textFormat(m, 2)}:${this.#textFormat(s, 2)}`;
    }

    reset() {
        this.time = 0;
        this.#updateText();
    }
}