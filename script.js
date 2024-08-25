let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timerInterval;
let totalPairs;
let soundEnabled = true;

// Sound Files
const flipSound = new Audio('flipsound.wav');
const matchSound = new Audio('matchsound.wav');
const winSound = new Audio('winsound.wav');

// Initialize the game
function startGame() {
    moves = 0;
    matches = 0;
    document.querySelector('.moves').textContent = '0 Moves';
    document.querySelector('.timer').textContent = 'Time: 0:00';

    clearInterval(timerInterval);
    startTimer();

    const difficulty = document.getElementById('difficulty').value;
    totalPairs = difficulty === '6x6' ? 18 : 8;

    createCards();
}

// Generate and shuffle cards with emojis
function generateCards(count, type) {
    let values;
    switch (type) {
        case 'fruits':
            values = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍑', '🍍', '🥑', '🥝', '🍊', '🍋', '🍐', '🍈', '🥭', '🍅', '🥥', '🍆'];
            break;
        case 'alphabets':
            values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
            break;
        case 'numbers':
            values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
            break;
        case 'symbols':
            values = ['😊', '😂', '😍', '😎', '🤔', '😢', '😠', '😴', '😷', '😳', '🤗', '😜', '😝', '😛', '😋', '😎', '😍', '🥳'];
            break;
        default:
            throw new Error('Invalid card type');
    }

    return shuffle([...values.slice(0, count), ...values.slice(0, count)]);
}

function createCards() {
    const gameBoard = document.querySelector('.game-board');
    const gridSize = document.getElementById('difficulty').value === '6x6' ? 6 : 4;
    
    // Get the selected card type from the HTML dropdown or selection input
    const cardType = document.getElementById('card-type').value;
    
    // Pass both totalPairs and cardType to the generateCards function
    const shuffledValues = generateCards(totalPairs, cardType);

    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 120px)`;
    gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 120px)`;

    shuffledValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.innerHTML = `
            <div class="front"></div>
            <div class="back">${value}</div>
        `;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Flip card function
function flipCard() {
    if (lockBoard || this === firstCard) return;

    if (soundEnabled) flipSound.play();
    this.classList.add('flip');
    
    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

// Check if the flipped cards match
function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    isMatch ? disableCards() : unflipCards();

    moves++;
    document.querySelector('.moves').textContent = `${moves} Moves`;
    if (isMatch && ++matches === totalPairs) {
        endGame();
    }
}

// Disable cards when matched
function disableCards() {
    if (soundEnabled) matchSound.play();
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    resetBoard();
}

// Unflip cards when not matched
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

// Reset board variables
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Start timer function
function startTimer() {
    const timerElement = document.querySelector('.timer');
    let seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerElement.textContent = `Time: ${minutes}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

// End game
function endGame() {
    clearInterval(timerInterval);
    if (soundEnabled) winSound.play();
    showWinMessage();
}

function showWinMessage() {
    const winningMessage = document.getElementById('winning-message');
    // Clear any previous content
    winningMessage.innerHTML = '';

    // Create and append the GIF image
    const gifImage = document.createElement('img');
    gifImage.src = 'CPT2408242126-506x319.gif'; // Replace with the path to your GIF
    winningMessage.appendChild(gifImage);

    // Create and append the winning message
    const messageText = document.createTextNode(`Congratulations! You won in ${moves} moves and ${document.querySelector('.timer').textContent.slice(5)}!`);
    winningMessage.appendChild(messageText);

    // Display the modal
    document.getElementById('winning-modal').style.display = 'flex';
}

// Close modal and restart game
function closeModalAndRestart() {
    document.getElementById('winning-modal').style.display = 'none';
    startGame();
}

// Toggle sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('toggle-sound').textContent = `Sound: ${soundEnabled ? 'ON' : 'OFF'}`;
}

// Restart game function
function restartGame() {
    startGame();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    startGame();
    document.getElementById('difficulty').addEventListener('change', startGame);
    document.getElementById('close-modal').addEventListener('click', closeModalAndRestart);
    document.getElementById('restart-modal').addEventListener('click', closeModalAndRestart);
    document.getElementById('toggle-sound').addEventListener('click', toggleSound);
    document.getElementById('restart-game').addEventListener('click', restartGame);
});
