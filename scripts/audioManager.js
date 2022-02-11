class AudioManager {
    constructor(audioFiles) {
        this.audioFiles = audioFiles;
    }

    init() {
        this.audio = document.createElement('audio');
        this.audio.style.display = 'none';
    }

    play(name) {
        const sound = this.audioFiles.find(a => a.name === name);
        if (sound) {
            this.audio.src = sound.src;
            this.audio.currentTime = 0;
            this.audio.play();
        }
    }
}