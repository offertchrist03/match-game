console.log("♥ Christ-Offert ♥");

// NE PAS AUTORISER L'UTIILISATEUR A INSPECTER
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

window.addEventListener("keydown", (e) => {
  e.preventDefault();
});

// * LES DONNEES
const dataCards = ["1", "2", "3", "4", "5", "6", "7", "8"];

const configs = { dataCards, cardCol: 4, cardSize: 60 };
// * LES DONNEES

const cardContainer = document.querySelector("#cardContainer");
const scoreElement = document.querySelector("#score");
const stepElement = document.querySelector("#step");
const finish = document.querySelector("#finish");

let cardsVerifier = [];
let cardFounds = [];

let step = 0;
let canClick = true;

let score = 0;
// ^AFFICHER SCORE
const showScore = (method) => {
  // if (!scoreElement) return;

  if (method === "increment") {
    score++;
  } else {
    score--;
  }

  if (score < 0) score = 0;

  // scoreElement.innerHTML = score < 10 ? "0" + score : score;
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
    }, 600);
  }

  if (selections.length === 2) {
    canClick = false;

    const timer = setTimeout(() => {
      selections = [];
      unshowCards();

      canClick = true;
      clearTimeout(timer);
    }, 600);
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

// ^CACHER LES CARDS TROUVEE
const unshowCards = () => {
  const allCards = document.querySelectorAll(".card");
  for (let index = 0; index < allCards.length; index++) {
    const cardItem = allCards[index];
    if (cardItem.classList.contains("show")) {
      cardItem.classList.remove("show");
    }
  }
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

  const delay = parseInt(Math.random() * 600);
  const duration = 600;

  const card = document.createElement("div");
  card.setAttribute("data-card", key);
  card.classList.add("card", "firstShow");

  card.style = `--animation-delay:${delay}ms;--animation-duration:${duration}ms`;

  const timer = setTimeout(() => {
    card.classList.remove("firstShow");
    card.style = ``;
    clearTimeout(timer);
  }, delay + duration);

  card.onclick = () => {
    if (!canClick) return;

    makeMove();
    card.classList.add("show");
    addToSelections(key);
  };

  divContainer.appendChild(card);

  const recto = document.createElement("div");
  recto.classList.add("recto");
  recto.innerHTML = children;

  card.appendChild(recto);

  const verso = document.createElement("div");
  verso.classList.add("verso");

  card.appendChild(verso);

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
