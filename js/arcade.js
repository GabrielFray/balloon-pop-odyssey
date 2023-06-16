const balloonContainer = document.querySelector(".content__balloons");
const balloonPoints = document.querySelector(".points");
const balloonRemains = document.querySelector(".remains");
const containerTimer = document.querySelector(".timer__number");
const bestScore = document.querySelector("#score");
const levelUpElement = document.querySelector(".level__up");
const levelTextElement = document.querySelector(".level__text");

const popBalloonSound = new Audio("../assets/soundtrack/bloon-pop-sound.mp3");
const balloonPopOdysseyTheme = new Audio(
  "../assets/soundtrack/bloons-theme.mp3.mpeg"
);
popBalloonSound.volume = 0.6;
balloonPopOdysseyTheme.volume = 0.04;
balloonPopOdysseyTheme.loop = true;

const QUANTITY_BALLOONS = [20, 20, 40];
const TOTAL_TIME_LEVEL = [25, 15, 25];

let arcadeLevel = 0;
let points = 0;
let timer = TOTAL_TIME_LEVEL[arcadeLevel];
let score = 0;

window.addEventListener("load", () => {
  if (location.pathname.includes("arcade.html")) {
    handleGameStart();
  }
});

const showLevelUp = (level) => {
  levelTextElement.textContent = `Nível ${level}`;
  levelUpElement.classList.add("show");
  setTimeout(hideLevelUp, 3000);
};

const hideLevelUp = () => {
  levelUpElement.classList.remove("show");
};

const updateCounters = () => {
  balloonPoints.innerHTML = points;
  balloonRemains.innerHTML = QUANTITY_BALLOONS[arcadeLevel] - points;
};

const updateBestScore = () => {
  const bestScoreLocalStorage = localStorage.getItem(
    "@balloonPopOdyssey:bestScore"
  );
  bestScore.innerHTML =
    bestScoreLocalStorage !== null && !isNaN(bestScoreLocalStorage)
      ? bestScoreLocalStorage
      : 0;
};

const showCongratulationsScreen = () => {
  const finishGame = document.querySelector(".congratulations");
  finishGame.style.display = "flex";
  setTimeout(() => {
    location.reload();
  }, 5000);
};

const poppedBalloon = (balloon) => {
  if (!balloon.classList.contains("balloon-popped")) {
    balloon.src = "../assets/balao_azul_grande_estourado.svg";
    balloon.classList.add("balloon-popped");
    points++;
    updateCounters();

    if (points === QUANTITY_BALLOONS[arcadeLevel]) {
      if (arcadeLevel < 2) {
        score += QUANTITY_BALLOONS[arcadeLevel];
        points = 0;
        arcadeLevel++;
        timer = TOTAL_TIME_LEVEL[arcadeLevel] + 1;
        updateCounters();
        setTimeout(() => {
          showLevelUp(arcadeLevel + 1);
        }, 100);

        createLevelBallon();
      } else {
        score += points;
        localStorage.setItem("@balloonPopOdyssey:bestScore", score);
        score = 0;
        points = 0;
        arcadeLevel = 0;
        timer = TOTAL_TIME_LEVEL[arcadeLevel];
        showCongratulationsScreen();
      }
    }
    popBalloonSound.currentTime = 0;
    popBalloonSound.play();
  }
};

const createLevelBallon = () => {
  balloonContainer.innerHTML = "";
  updateCounters();
  containerTimer.innerHTML = TOTAL_TIME_LEVEL[arcadeLevel];
  updateBestScore();

  for (let i = 0; i < QUANTITY_BALLOONS[arcadeLevel]; i++) {
    const balloon = document.createElement("img");
    balloon.src = "../assets/balao_azul_grande.svg";
    balloon.alt = "Balão azul";
    balloon.draggable = false;
    balloon.classList.add("balloon");

    balloonContainer.appendChild(balloon);

    balloon.addEventListener("click", (event) => {
      event.stopPropagation();
      poppedBalloon(balloon);
    });
  }
};

const handleGameLost = () => {
  const bestScoreLocalStorage = localStorage.getItem(
    "@balloonPopOdyssey:bestScore"
  );

  score += points;

  if (Number(bestScoreLocalStorage) < score) {
    localStorage.setItem("@balloonPopOdyssey:bestScore", score);
    updateBestScore();
  }

  score = 0;
  points = 0;
  arcadeLevel = 0;
  timer = TOTAL_TIME_LEVEL[arcadeLevel];
  showLevelUp(arcadeLevel + 1);
  createLevelBallon();

  setTimeout(() => {
    alert("Voce perdeu, tente novamente!");
  }, 100);
};

const handleRoundTime = () => {
  if (timer > 0) {
    timer -= 1;
    containerTimer.innerHTML = timer;
  } else {
    handleGameLost();
  }
};

const applyPenalties = () => {
  if (arcadeLevel === 0) {
    return;
  } else if (arcadeLevel === 1) {
    timer -= 1;
    containerTimer.innerHTML = timer;
  } else {
    handleGameLost();
  }
};

if (balloonContainer) {
  balloonContainer.addEventListener("click", (event) => {
    applyPenalties();
    event.stopPropagation();
  });
}

const handleGameStart = () => {
  balloonPopOdysseyTheme.play();
  showLevelUp(arcadeLevel + 1);

  setInterval(() => {
    handleRoundTime();
  }, 1000);

  createLevelBallon();
};

// const modalGameOver = document.getElementById("modal__game-over");

// const restartGameButton = document.getElementById("restart__game-button");

// const restartGame = () => {
//   modalGameOver.style.display = "flex";
//   startGame();
// };

// restartGameButton.addEventListener("click", restartGame);
