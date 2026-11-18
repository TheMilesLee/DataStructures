const dataInput = document.getElementById("data-input");
const hashMethod = document.getElementById("modulo-choice");
const runButton = document.getElementById("start-button");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");
const animationStatus = document.getElementById("animation-status");
const stepMessage = document.getElementById("step-message");
const stepCount = document.getElementById("step-count");
const moduloExplanation = document.getElementById("modulo-explanation");
const hashSlots = document.querySelectorAll(".hash-slot");
const tableSize = 10;
const stepDelay = 1200;
const resultDelay = 2200;
let inputData = "";
let animationSteps = [];
let currentStep = -1;
let tableSpace = 0;
let animationTimer = null;
let isPlaying = false;
function showStepMessage(text) {
  stepMessage.classList.remove("show");
  stepMessage.textContent = text;
  stepMessage.offsetWidth;
  stepMessage.classList.add("show");
}
function clearHashTable() {
  hashSlots.forEach(function (slot) {
    slot.classList.remove("target");
    const value = slot.querySelector(".slot-content");
    value.classList.remove("filled");
    value.textContent = "";
  });
}
function updateButtons() {
  runButton.disabled =
    dataInput.value.length === 0 || !hashMethod.checked || isPlaying;
  previousButton.disabled = currentStep <= 0;
  nextButton.disabled =
    currentStep < 0 || currentStep === animationSteps.length - 1;
}
function createAnimationSteps() {
  const characters = Array.from(inputData);
  const characterCodes = [];
  let total = 0;
  animationSteps = ['Starting with "' + inputData + '".'];
  for (let i = 0; i < characters.length; i += 1) {
    const character = characters[i];
    const characterCode = character.codePointAt(0);
    const shownCharacter = character === " " ? "[space]" : character;
    characterCodes.push(characterCode);
    total += characterCode;
    animationSteps.push(
      "Character " + (i + 1) + " of " + characters.length + ": " +
      shownCharacter + " = " + characterCode +
      ". Running total: " + total + "."
    );
  }
  tableSpace = total % tableSize;
  animationSteps.push(
    "Add the character codes: " + characterCodes.join(" + ") + " = " +
    total + ". Then " + total + " % " + tableSize + " = " + tableSpace + "."
  );
  animationSteps.push("The data is put in space " + tableSpace + ".");
}
function showCurrentStep() {
  const lastStep = animationSteps.length - 1;
  showStepMessage(animationSteps[currentStep]);
  stepCount.textContent =
    "Step " + (currentStep + 1) + " of " + animationSteps.length;
  animationStatus.textContent = "Step " + (currentStep + 1);
  clearHashTable();
  if (currentStep === lastStep) {
    const slot = hashSlots[tableSpace];
    const value = slot.querySelector(".slot-content");
    value.textContent = inputData;
    value.classList.add("filled");
    slot.classList.add("target");
  }
  if (isPlaying && currentStep < lastStep) {
    const delay = currentStep === lastStep - 1 ? resultDelay : stepDelay;
    animationTimer = setTimeout(function () {
      currentStep += 1;
      showCurrentStep();
    }, delay);
  } else if (isPlaying) {
    isPlaying = false;
    dataInput.disabled = false;
    hashMethod.disabled = false;
    runButton.textContent = "Run again";
  }
  updateButtons();
}
function resetAnimation(text) {
  clearTimeout(animationTimer);
  isPlaying = false;
  inputData = "";
  animationSteps = [];
  currentStep = -1;
  dataInput.disabled = false;
  runButton.textContent = "Run";
  clearHashTable();
  stepMessage.classList.remove("show");
  stepMessage.textContent = text;
  stepCount.textContent = "Use Run to begin";
  animationStatus.textContent = "Ready when you are.";
  updateButtons();
}
function startAnimation() {
  if (runButton.disabled) {
    return;
  }
  inputData = dataInput.value;
  createAnimationSteps();
  currentStep = 0;
  isPlaying = true;
  dataInput.disabled = true;
  hashMethod.disabled = true;
  runButton.textContent = "Running...";
  showCurrentStep();
}
function moveStep(change) {
  if (animationSteps.length === 0) {
    return;
  }
  clearTimeout(animationTimer);
  isPlaying = false;
  dataInput.disabled = false;
  hashMethod.disabled = false;
  currentStep = Math.max(
    0,
    Math.min(currentStep + change, animationSteps.length - 1)
  );
  runButton.textContent = "Run again";
  showCurrentStep();
}
dataInput.addEventListener("input", function () {
  resetAnimation("Choose a hash method after typing your data");
  hashMethod.disabled = dataInput.value.length === 0;
  if (dataInput.value.length === 0) {
    hashMethod.checked = false;
    moduloExplanation.hidden = true;
    animationStatus.textContent = "Type some data to begin.";
  } else if (hashMethod.checked) {
    animationStatus.textContent = "Ready to run";
  } else {
    animationStatus.textContent = "Choose the hash method.";
  }
});
hashMethod.addEventListener("change", function () {
  resetAnimation("Add the character codes, then find the remainder.");
  moduloExplanation.hidden = !hashMethod.checked;
  animationStatus.textContent = "Ready to run";
});
runButton.addEventListener("click", startAnimation);
previousButton.addEventListener("click", function () {
  moveStep(-1);
});
nextButton.addEventListener("click", function () {
  moveStep(1);
});
updateButtons();
