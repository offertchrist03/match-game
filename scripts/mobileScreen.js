const minWidth = 320;
const minHeight = 550;

const notHTMLElements = ["#text", "SCRIPT", "#comment"];

const main = () => {
  const createFallback = () => {
    const div = document.createElement("div");
    div.id = "fallback";
    div.classList.add("absolute-center", "text-center");
    div.innerHTML = `<span class="title">MATCH GAME</span><p class="" style="color:red;margin-top:8px">veuillez utiliser un ecran plus large</p>`;
    return div;
  };

  const body = document.body;

  const elements = body.childNodes;

  if (
    window.screen.availWidth >= minWidth &&
    window.screen.availHeight >= minHeight
  ) {
    elements.forEach((element) => {
      const element = elements[index];
      if (
        !element.nodeName.startsWith("#") &&
        !notHTMLElements.includes(element.nodeName) &&
        element.classList.contains("hidden")
      ) {
        element.classList.remove("hidden");
      }
    });

    const fallback = document.querySelector("#fallback");
    if (fallback) fallback.remove();
  } else {
    elements.forEach((element) => {
      if (
        !element.nodeName.startsWith("#") &&
        !notHTMLElements.includes(element.nodeName) &&
        !element.classList.contains("hidden")
      ) {
        element.classList.add("hidden");
      }
    });

    const fallback = createFallback();
    body.appendChild(fallback);
  }
};

main();

// Autorise seulement les ecrans > minWidth
window.addEventListener("resize", (ev) => {
  main();
});
