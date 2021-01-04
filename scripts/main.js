// Global variables
let generateButton = document.querySelector(".generate button");
let colorHeads = document.querySelectorAll(".color h1");
let unlockedColorDivs = document.getElementsByClassName("unlocked");
let colorDivs = document.getElementsByClassName("color");
let lockBtn = document.querySelectorAll(".lockBtn");
let lockBtnImg = document.querySelector(".lockBtn img");
let clipBoardMsg = document.querySelector(".clipboardMsg");
let adjustBtn = document.querySelectorAll(".adjustBtn");
let adjustInput = document.querySelectorAll(".adjust input");
let saveBtn = document.querySelector(".saveBtn button");
let savePalettePrompt = document.querySelector(".save");
let savePaletteCloseBtn = document.querySelector(".close");
let savePaletteSaveBtn = document.querySelector(".save button");
let libraryBtn = document.querySelector(".libraryBtn button");
let library = document.querySelector(".library");
let closeLibraryBtn = document.querySelector(".closeLibrary");
let libraryContainer = document.querySelector(".libraryContainer");

// Function, obj and classes
let colorPalette = {
  generateColors() {
    for (let colorDiv of unlockedColorDivs) {
      if (!colorDiv.classList.contains("locked")) {
        let randomColor = chroma.random();
        let colorsDivChild = colorDiv.children[0];
        colorDiv.style.backgroundColor = randomColor;
        colorsDivChild.innerText = randomColor;
      }
    }
  },

  checkContrast() {
    for (let colorDiv of colorDivs) {
      if (chroma.contrast(colorDiv.style.backgroundColor, "black") > "5") {
        colorDiv.style.color = "black";
      } else colorDiv.style.color = "white";
    }
  },

  lockColor(btn) {
    btn.parentElement.classList.toggle("locked");
    if (btn.children[0].getAttribute("src") == "./assets/icons/padlock.svg") {
      btn.children[0].setAttribute("src", "./assets/icons/unlocked.svg");
    } else {
      btn.children[0].setAttribute("src", "./assets/icons/padlock.svg");
    }
  },
  copyToClipboard(head) {
    let tempInput = document.createElement("input");
    tempInput.value = head.innerText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    clipBoardMsg.children[0].classList.add("active");
    clipBoardMsg.classList.add("active");
    clipBoardMsg.children[0].addEventListener("transitionend", () => {
      clipBoardMsg.children[0].classList.remove("active");
      clipBoardMsg.classList.remove("active");
    });
  },
  openAdjustPanel() {
    let adjust = this.parentElement.querySelector(".adjust");
    adjust.classList.toggle("active");
  },

  adjust() {
    let parentDiv = this.parentElement.parentElement;
    let parentElementBackgroundInHsl = chroma(
      this.parentElement.parentElement.style.backgroundColor
    ).hsl();
    parentElementBackgroundInHsl[1] = parentElementBackgroundInHsl[1] * 100;
    parentElementBackgroundInHsl[2] = parentElementBackgroundInHsl[2] * 100;
    if (this.classList[0] == "hueInput") {
      this.parentElement.querySelector(".hueValue").innerText = this.value;
      parentElementBackgroundInHsl[0] = this.value;
      parentDiv.style.backgroundColor = `hsl(${parentElementBackgroundInHsl[0]}, ${parentElementBackgroundInHsl[1]}%, ${parentElementBackgroundInHsl[2]}%`;
    }
    if (this.classList[0] == "lightnessInput") {
      this.parentElement.querySelector(
        ".lightnessValue"
      ).innerText = this.value;
      parentElementBackgroundInHsl[2] = this.value;
      parentDiv.style.backgroundColor = `hsl(${parentElementBackgroundInHsl[0]}, ${parentElementBackgroundInHsl[1]}%, ${parentElementBackgroundInHsl[2]}%`;
    }
    if (this.classList[0] == "saturationInput") {
      this.parentElement.querySelector(
        ".saturationValue"
      ).innerText = this.value;
      parentElementBackgroundInHsl[1] = this.value;
      parentDiv.style.backgroundColor = `hsl(${parentElementBackgroundInHsl[0]}, ${parentElementBackgroundInHsl[1]}%, ${parentElementBackgroundInHsl[2]}%`;
    }
  },

  savePalettePrompt() {
    savePalettePrompt.classList.add("active");
    savePalettePrompt.children[0].classList.add("active");
  },

  closeSavePrompt() {
    savePalettePrompt.classList.remove("active");
    savePalettePrompt.children[0].classList.remove("active");
  },

  savePalette() {
    let inputValue = document.querySelector(".save input").value;
    this.closeSavePrompt();
    let colors = [];
    for (let div of colorDivs) {
      colors.push(div.style.backgroundColor);
    }
    let colorsString = JSON.stringify(colors);
    localStorage.setItem(inputValue, colorsString);
    console.log(localStorage.getItem(inputValue));
    alert("Your palette has been saved.");
  },

  openLibraryPrompt() {
    library.classList.add("active");
    library.children[0].classList.add("active");
  },

  closeLibraryPrompt() {
    library.classList.remove("active");
    library.children[0].classList.remove("active");
  },

  displayLibraryColors() {
    console.log(colorDivs);
    for (let a = 0; a < colorDivs.length; a++) {
      console.log(colorDivs[a].style.backgroundColor = JSON.parse(localStorage.getItem(this.innerText))[a]);
    }
    console.log(JSON.parse(localStorage.getItem(this.innerText)));
    colorPalette.closeLibraryPrompt();

  },

  fetchLibrary() {
    for (let a = 0; a < localStorage.length; a++) {
      let newLib = document.createElement("div");
      newLib.classList.add("lib");
      newLib.innerText = Object.keys(localStorage)[a];
      console.log(Object.keys(localStorage)[a]);
      libraryContainer.appendChild(newLib);
      newLib.addEventListener("click", this.displayLibraryColors);
    }
  },
};

// Event Listeners
generateButton.addEventListener("click", () => {
  colorPalette.generateColors();
  colorPalette.checkContrast();
});

lockBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    colorPalette.lockColor(btn);
  });
});

colorHeads.forEach((head) => {
  head.addEventListener("click", () => {
    colorPalette.copyToClipboard(head);
  });
});

adjustBtn.forEach((btn) => {
  btn.addEventListener("click", colorPalette.openAdjustPanel);
});

adjustInput.forEach((input) => {
  input.addEventListener("input", colorPalette.adjust);
});

adjustInput.forEach((input) => {
  input.addEventListener("input", colorPalette.checkContrast);
});

savePaletteCloseBtn.addEventListener("click", colorPalette.closeSavePrompt);

saveBtn.addEventListener("click", colorPalette.savePalettePrompt);

savePaletteSaveBtn.addEventListener("click", () => {
  colorPalette.savePalette();
});

libraryBtn.addEventListener("click", () => {
  colorPalette.openLibraryPrompt();
  colorPalette.fetchLibrary();
});

closeLibraryBtn.addEventListener("click", () => {
  colorPalette.closeLibraryPrompt();
});

// Button to be clicked automatically when the page reloads
generateButton.click();
