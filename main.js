const scrollRow = document.querySelector('.scroll__row');

const wInput = document.getElementById('w');
const hInput = document.getElementById('h');
const mInput = document.getElementById('m');

const startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', function () {
    game.newGame({
        rows: wInput.value,
        columns: hInput.value,
        mines: mInput.value,
        spacing: 5
    });

    timer.reset();
    timer.start();
    
    switchPanel('game');
});

const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', function () {
    timer.stop();
    switchPanel('menu');
});

const messageCloseBtn = document.querySelector('.message__close-btn');
messageCloseBtn.addEventListener('click', function () {
    switchPanel('game');
});

const gameRestartBtn = document.querySelector('.game-restart-btn');
gameRestartBtn.addEventListener('click', function () {
    game.reset();
    timer.reset();
    timer.start();

    switchPanel('game');
});

const messageTitle = document.querySelector('.message__title');
const messageText = document.querySelector('.message__text');
function showMessage(title, text){
    messageTitle.innerHTML = title;
    messageText.innerHTML = text;
}


const audioManager = new AudioManager([
    {name: 'Flag', src: 'audio/flag.ogg'},
    {name: 'Win', src: 'audio/win.ogg'},
    {name: 'Lose', src: 'audio/lose.ogg'},
    {name: 'Button', src: 'audio/button.ogg'},
    {name: 'Mine', src: 'audio/mine.ogg'},
    {name: 'Cell', src: 'audio/cell.ogg'}
]);
audioManager.init();

const timer = new Timer(document.querySelector('.timer'), 1000);

function switchPanel(panel){
    switch (panel) {
        case 'menu':
            audioManager.play('Button');
            scrollRow.style.transform = 'translateX(0)';
            break;
        case 'game':
            audioManager.play('Button');
            scrollRow.style.transform = 'translateX(-100%)';
            break;
        case 'gameEnd':
            scrollRow.style.transform = 'translateX(-200%)';
            break;
    }
}

function onGameEnd(notificationType){
    timer.stop();

    switch (notificationType) {
        case GameEndNotification.WIN:
            audioManager.play('Win');
            showMessage('You win!', `Concratulations! You've won the game! <br>
            Your time: <span class="timer">${timer.getTime()}</span>`);
            break;
        case GameEndNotification.ENDED_FLAG:
            audioManager.play('Lose');
            showMessage('You lose!', `Your flag count is 0! <br>
            Played time: <span class="timer">${timer.getTime()}</span>`);
            break;
        case GameEndNotification.PRESSED_ON_MINE:
            audioManager.play('Lose');
            showMessage('You lose!', `You stepped on a mine! <br>
            Played time: <span class="timer">${timer.getTime()}</span>`);
    }

    switchPanel('gameEnd');
}

function onCell(notificationType){
    switch (notificationType) {
        case CellNotification.CELL_OPENED:
            window.navigator.vibrate(20);
            audioManager.play('Cell');
            break;
        case CellNotification.MINE_OPENED:
            window.navigator.vibrate(200);
            audioManager.play('Mine');
            break;
        case CellNotification.FLAGGED:
            window.navigator.vibrate(50);
            audioManager.play('Flag');
            break;
    }
}

const game = new Minesweeper(document.querySelector('.grid'), {
    flagCounterEL: document.querySelector('.flag-count'),
    onGameEnd: onGameEnd,
    onCell: onCell
});
game.init();


