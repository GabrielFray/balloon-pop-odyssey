const balloonContainer = document.querySelector(".content__balloons");
const balloonPoints = document.querySelector(".points");
const bestScore = document.querySelector("#score");

const popBalloonSound = new Audio("../assets/soundtrack/bloon-pop-sound.mp3");
const balloonPopOdysseyTheme = new Audio(
  "../assets/soundtrack/bloons-theme.mp3.mpeg"
);
popBalloonSound.volume = 0.6;
balloonPopOdysseyTheme.volume = 0.04;
balloonPopOdysseyTheme.loop = true;

const bonusThreshold = 10;
const bonusPoints = 5;

let points = 0;
let balloonsPopped = 0;
let score = 0;
balloonPoints.innerHTML = points;

const updateBestScore = () => {
  const bestScoreLocalStorage = localStorage.getItem(
    "@balloonPopOdyssey:bestScore"
  );
  bestScore.innerHTML =
    bestScoreLocalStorage !== null && !isNaN(bestScoreLocalStorage)
      ? bestScoreLocalStorage
      : 0;
};

const poppedBalloon = (balloon) => {
  if (!balloon.classList.contains("balloon-popped")) {
    balloon.classList.add("balloon-popped");
    balloon.src = "../assets/balao_azul_grande_estourado.svg";
    points++;
    balloonPoints.innerHTML = points;
    balloonsPopped++;

    if (balloonsPopped % bonusThreshold === 0) {
      score += bonusPoints;
      points += bonusPoints;
      balloonPoints.innerHTML = points;

      alert(`Bônus! Você ganhou ${bonusPoints} pontos.`);
    }

    popBalloonSound.currentTime = 0;
    popBalloonSound.play();

    setTimeout(() => {
      balloonContainer.removeChild(balloon);
      createRandomBalloon();
    }, 500);
  }
};

const createRandomBalloon = () => {
  const balloon = document.createElement("img");
  balloon.src = "../assets/balao_azul_grande.svg";
  balloon.alt = "Balão azul";
  balloon.draggable = false;
  balloon.classList.add("balloon__survivor");

  updateBestScore();

  const containerWidth = balloonContainer.offsetWidth;
  const containerHeight = balloonContainer.offsetHeight;
  const balloonWidth = 70;
  const balloonHeight = 85;

  const maxX = containerWidth - balloonWidth;
  const maxY = containerHeight - balloonHeight;

  const randomX = Math.floor(Math.random() * (maxX + 1));
  const randomY = Math.floor(Math.random() * (maxY + 1));

  balloon.style.left = randomX + "px";
  balloon.style.top = randomY + "px";

  balloonContainer.appendChild(balloon);

  balloon.addEventListener("click", (event) => {
    event.stopPropagation();
    poppedBalloon(balloon);
  });
};

const handleGameLost = () => {
  const bestScoreLocalStorage = localStorage.getItem(
    "@balloonPopOdyssey:bestScore"
  );

  score = points;

  if (Number(bestScoreLocalStorage) < score) {
    localStorage.setItem("@balloonPopOdyssey:bestScore", score);
    updateBestScore();
  }

  alert(`Fim de jogo! Sua pontuação final: ${points}`);

  points = 0;
  balloonsPopped = 0;
  balloonPoints.innerHTML = 0;
};

const handleGameStart = () => {
  balloonPopOdysseyTheme.play();
  createRandomBalloon();
};

balloonContainer.addEventListener("click", (event) => {
  if (event.target === balloonContainer) {
    handleGameLost();
  }
});

window.addEventListener("load", () => {
  if (location.pathname.includes("survivor.html")) {
    handleGameStart();
  }
});
