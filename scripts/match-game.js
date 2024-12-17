console.log("♥ Christ-Offert ♥");

// * LES DONNEES
const globalAnimationDuration = 600;
const dataImage = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
];
const dataCards = dataImage.map((img)=> img.replace(".jpg",""));

const configs = { dataCards, cardCol: 4, cardSize: 58 };
// * FIN LES DONNEES

const cardContainer = document.querySelector("#cardContainer");
const scoreElement = document.querySelector("#score");
const stepElement = document.querySelector("#step");
const finish = document.querySelector("#finish");

let cardsVerifier = [];
let cardFounds = [];

let step = 0;
let canClick = true;

let score = 0;

// ^AFFICHER ET COMPTE SCORE
const showScore = (method) => {
  if (method === "increment") {
    score++;
  } else {
    score--;
  }

  if (score < 0) score = 0;

  if (!scoreElement) return;
  scoreElement.innerHTML = score < 10 ? "0" + score : score;
};

const selectionsElement = document.querySelector("#selections");
let selections = [];

// ^SAVOIR SI LES SELECTIONS SONT LES MEMES
const compareSelections = () => {
  const finalScore = dataCards.length;
  const selection1 = cardsVerifier[selections[0]];
  const selection2 = cardsVerifier[selections[1]];

  if (selection1 === selection2) {
    showScore("increment");
    cardFounds = [...selections];

    const timer = setTimeout(() => {
      hideFounds(selections);
      canClick = true;

      // * SI TOUT EST TROUVEE
      if (score >= finalScore) {
        finish.classList.add("done");
        canClick = false;
      }

      clearTimeout(timer);
    }, globalAnimationDuration);
  }

  if (selections.length === 2) {
    canClick = false;

    const timer = setTimeout(() => {
      selections = [];
      unshowCards();

      canClick = true;
      clearTimeout(timer);
    }, globalAnimationDuration);
  }
};

// ^AJOUT A LA SELECTION
const addToSelections = (value = "") => {
  if (
    selections.length >= 2 ||
    selections.includes(value) ||
    cardFounds.includes(value)
  )
    return;

  selections.push(value);
  compareSelections();
};

// ^CACHER LES CARDS TROUVEE
const hideFounds = (founds = ["0", "1"]) => {
  const dataFounds = founds.map((found) => found + "");

  const allCards = document.querySelectorAll(".card");
  for (let index = 0; index < allCards.length; index++) {
    const cardItem = allCards[index];
    const data = cardItem.getAttribute("data-card");
    if (dataFounds.includes(data)) {
      cardItem.classList.add("found");
    }
  }
};

// ^RETOURNER LES CARDS SELECTIONNER
const unshowCards = () => {
  const allCards = document.querySelectorAll(".card");
  for (let index = 0; index < allCards.length; index++) {
    const cardItem = allCards[index];
    if (cardItem.classList.contains("show")) {
      cardItem.classList.remove("show");
    }
  }

  const images = document.querySelectorAll(".image");
  const timer = setTimeout(() => {
    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      image.remove();
    }
    clearTimeout(timer);
  }, globalAnimationDuration);
};

// ^INCREMENTER MOUVMENT
const makeMove = () => {
  step++;
  stepElement.innerHTML = step < 10 ? "0" + step : step;
};

// ^CREER UNE CARD
const createCard = (children, key) => {
  const divContainer = document.createElement("div");
  divContainer.classList.add("card-parent");

  const delay = parseInt(Math.random() * globalAnimationDuration);
  const duration = globalAnimationDuration;

  const card = document.createElement("div");
  card.setAttribute("data-card", key);
  card.classList.add("card", "firstShow");

  card.style = `--animation-delay:${delay}ms;--animation-duration:${duration}ms`;

  const timer = setTimeout(() => {
    card.classList.remove("firstShow");
    card.style = ``;
    clearTimeout(timer);
  }, delay + duration);

  divContainer.appendChild(card);

  const recto = document.createElement("div");
  recto.classList.add("recto");
  // recto.innerHTML = children;

  card.appendChild(recto);

  const verso = document.createElement("div");
  verso.classList.add("verso");

  card.appendChild(verso);
  
  card.onclick = () => {
    if (!canClick) return;

    // ^ GENERER L'IMAGE
    const img = document.createElement("img");
    img.classList.add("image");
    img.src = "./assets/images/" + dataImage[parseInt(children) - 1];
    recto.appendChild(img);

    makeMove();
    card.classList.add("show");
    addToSelections(key);
  };

  return divContainer;
};

// ^SHUFFLE DATA
const shuffleCards = (cards = []) => {
  let datas = cards;
  let res = [];

  for (let index = 0; index < cards.length; index++) {
    if (datas.length > 0) {
      let element = datas[parseInt(Math.random() * datas.length)];

      const newDatas = datas.filter((data) => data !== element);
      datas = newDatas;

      res.push(element);

      const elementsInRes = res.filter((data) => data === element);
      if (elementsInRes.length < 2) {
        datas.push(element);
      }
    }
  }

  return res;
};

// ^AFFICHER LES CARDS
const displayGameCards = () => {
  const { dataCards, cardCol, cardSize } = configs;

  if (!dataCards) return;

  cardContainer.style = `--grid-col:${cardCol};--card-size: ${cardSize}px`;

  const cardsShuffled = shuffleCards([...dataCards, ...dataCards]);
  cardsVerifier = cardsShuffled;

  for (let index = 0; index < cardsShuffled.length; index++) {
    const element = cardsShuffled[index];

    const div = createCard(element, index);
    cardContainer.appendChild(div);
  }

  showScore("decrement");
};

const resetButton = document.querySelector("#resetButton");
// ^RESET GAME
const resetGame = () => {
  finish.classList.remove("done");

  // * SAUVEGARDE LA MEILLEURE MOUVEMENT
  window.localStorage.setItem("bestMove", step + "");

  cardsVerifier = [];
  cardFounds = [];

  step = 0;
  stepElement.innerHTML = "--";

  canClick = true;
  score = 0;
  selections = [];

  // ^SUPPRIME LES ANCIENNE CARD
  const allCards = document.querySelectorAll(".card-parent");
  for (let index = 0; index < allCards.length; index++) {
    const cardItem = allCards[index];
    cardItem.remove();
  }

  // * RE-LANCE LE JEU
  displayGameCards();
};

// * LANCE LE JEU
displayGameCards();
