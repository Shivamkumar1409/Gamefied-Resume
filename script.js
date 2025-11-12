const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');
const levelUpBtn = document.getElementById('levelUpBtn');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

let level = 1;
let cardsArray = [];
let flippedCards = [];
let score = 0;
let confettiPieces = [];

const emojis = ['🍕','🍔','🍩','🍎','🍇','🍓','🍪','🥝','🍉','🍍','🍒','🍑','🥐','🍫','🍿','🍰'];

function setupGame() {
  gameBoard.innerHTML = '';
  score = 0;
  scoreDisplay.textContent = score;
  flippedCards = [];
  confettiPieces = [];


  let pairs = 4 + (level - 1) * 2; // level1:4 pairs, level2:6 pairs...
  if (pairs > emojis.length) pairs = emojis.length;

  let chosen = emojis.slice(0, pairs);
  cardsArray = [...chosen, ...chosen];
  cardsArray.sort(() => 0.5 - Math.random());

  // set columns approximate to sqrt of total cards
  let cols = Math.sqrt(cardsArray.length);
  cols = Math.round(cols);
  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 100px)`;

  for (let emoji of cardsArray) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="inner-card">
        <div class="front">?</div>
        <div class="back">${emoji}</div>
      </div>
    `;
    card.addEventListener('click', () => flipCard(card, emoji));
    gameBoard.appendChild(card);
  }
}

function flipCard(card, emoji) {
  if (flippedCards.length < 2 && !card.classList.contains('flip')) {
    card.classList.add('flip');
    flippedCards.push({ card, emoji });

    if (flippedCards.length === 2) checkMatch();
  }
}

function checkMatch() {
  const [a, b] = flippedCards;
  if (a.emoji === b.emoji) {
    score++;
    updateScore();
    flippedCards = [];
  } else {
    setTimeout(() => {
      a.card.classList.remove('flip');
      b.card.classList.remove('flip');
      flippedCards = [];
    }, 700);
  }
}

function updateScore() {
  scoreDisplay.textContent = score;
  // thresholds (you can change)
  if (score === 2) triggerUnlock('about');
  if (score === 4) triggerUnlock('skills');
  if (score === 6) triggerUnlock('projects');
  if (score === 8) triggerUnlock('education');
  if (score === 10) triggerUnlock('contact');
}

function triggerUnlock(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.classList.contains('hidden')) {
    el.classList.remove('hidden');
    confetti();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

restartBtn.addEventListener('click', () => {
  level = 1;
  setupGame();
});

levelUpBtn.addEventListener('click', () => {
  level++;
  setupGame();
});

function confetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  for (let i = 0; i < 110; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: Math.random() * 6 + 3,
      d: Math.random() * 10,
      color: `hsl(${Math.random() * 360}, 90%, 60%)`,
      tilt: Math.random() * 20 - 10
    });
  }

  requestAnimationFrame(animateConfetti);
}

let confettiAnimating = false;
function animateConfetti() {
  if (!confettiPieces.length) return;
  confettiAnimating = true;
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (let p of confettiPieces) {
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.r, p.r/1.6, p.tilt * Math.PI/180, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    p.y += Math.cos(p.d) + 1 + p.r / 2;
    p.x += Math.sin(p.d / 2);
    p.tilt += 0.5;
    if (p.y > confettiCanvas.height + 20) {
      p.y = -10;
      p.x = Math.random() * confettiCanvas.width;
    }
  }
  requestAnimationFrame(animateConfetti);
}

// responsive canvas on resize
window.addEventListener('resize', () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});

setupGame();