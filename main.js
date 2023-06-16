const arcadeButton = document.querySelector(".arcade");
const survivorButton = document.querySelector(".survivor");
const returnButton = document.querySelector(".return");

const redirectToPage = (path) => {
  location.replace(path);
};

if (arcadeButton) {
  arcadeButton.addEventListener("click", (event) => {
    redirectToPage("./pages/arcade.html");
    event.stopPropagation();
  });
}

if (returnButton) {
  returnButton.addEventListener("click", (event) => {
    redirectToPage("../index.html");
    event.stopPropagation();
  });
}

if (survivorButton) {
  survivorButton.addEventListener("click", (event) => {
    redirectToPage("./pages/survivor.html");
    event.stopPropagation();
  });
}
