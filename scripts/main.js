// Global variables
let generateButton = document.querySelector(".generate button");
let colorHeads = document.querySelectorAll(".color h1");
let unlockedColorDivs = document.getElementsByClassName("unlocked");
let lockBtn = document.querySelectorAll(".lockBtn");
let lockBtnImg = document.querySelector(".lockBtn img");
let clipBoardMsg = document.querySelector(".clipboardMsg");
let adjustBtn = document.querySelectorAll(".adjustBtn");
let adjustInput = document.querySelectorAll(".adjust input");

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
};

// Event Listeners
generateButton.addEventListener("click", colorPalette.generateColors);

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

// Button to be clicked automatically when the page reloads
generateButton.click();
