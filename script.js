const previous = document.querySelector("#previous");
const current = document.querySelector("#current");
const buttons = document.querySelectorAll("button");

const regexDecimal = /^\d*\.\d*$/;
const regexEquals = /=/;
const regexExponential = /e[+]/;
const regexNumber = /[0-9]/;
const regexOperator = /[\+\-\*\/\%]/;

let clickedDecimal = false;
let clickedOperator = false;
let count = 0;

buttons.forEach((button) =>
  button.addEventListener("click", keyPressed, false)
);
document.addEventListener("keydown", keyPressed, false);

function keyPressed(e) {
  const screenPressed = e.target.getAttribute("data-key");
  const keyboardPressed = e.key;

  const value = keyboardPressed || screenPressed;

  switch (value) {
    case "Backspace":
      backspace();
      break;
    case "Clear_Entry":
      clear_entry();
      break;
    case "Enter":
      equals();
      break;
    case "Escape":
      clear();
      break;
    default:
      if (regexNumber.test(value)) {
        getButtonText(value, number);
      } else if (regexDecimal.test(value)) {
        getButtonText(value, decimal);
      } else if (regexOperator.test(value)) {
        getButtonText(value, operator);
      }
  }
}

function getButtonText(dataKey, callback) {
  const button = document.querySelector(
    `button[data-key="${dataKey}"]`
  ).textContent;
  if (button) callback(button);
}

function number(button_text) {
  if (current.textContent === "0") {
    current.textContent = "";
  }
  if (clickedOperator && clickedDecimal == false) {
    clickedOperator = false;
    current.textContent = "";
  }
  if (regexEquals.test(previous.textContent)) {
    clickedDecimal = false;
    previous.textContent = "";
    current.textContent = "";
  }
  if (removeComma(current.textContent).length < 11) {
    if (button_text !== undefined) {
      let commaSeparated = removeComma(current.textContent) + button_text;
      current.textContent = addPunctuation(commaSeparated);
    }
  }
}

function operator(button_text) {
  clickedDecimal = false;
  clickedOperator = true;
  count++;

  if (count >= 2 && current.textContent !== previous.textContent.slice(0, -2)) {
    const operator = previous.textContent.slice(-1);
    compute(operator);
  }
  previous.textContent = `${current.textContent} ${button_text}`;
}

function decimal(button_text) {
  if (
    regexDecimal.test(previous.textContent) &&
    current.textContent == previous.textContent.slice(0, -2)
  ) {
    current.textContent = "0" + button_text;
  } else if (!clickedDecimal) {
    current.textContent += button_text;
  }
  clickedDecimal = true;
}

function compute(operator) {
  const temp_1 = parseFloat(removeComma(previous.textContent.slice(0, -2)));
  const temp_2 = parseFloat(removeComma(current.textContent));

  let total;

  switch (operator) {
    case "+":
      total = temp_1 + temp_2;
      break;
    case "×":
      total = temp_1 * temp_2;
      break;
    case "−":
      total = temp_1 - temp_2;
      break;
    case "÷":
      total = temp_1 / temp_2;
      break;
    case "%":
      total = temp_1 % temp_2;
      break;
  }
  if (total == "Infinity") {
    current.textContent = "UNDEFINED";
  } else if (total.toString().length < 10) {
    current.textContent = addPunctuation(total);
  } else {
    current.textContent = total.toExponential(2);
  }
}

function addPunctuation(number) {
  if (regexDecimal.test(number)) {
    return number;
  }
  let array = number.toString().split("");
  let output = "";
  let first = true;
  for (let i = array.length - 1; i >= 0; i--) {
    if ((array.length - i - 1) % 3 === 0) {
      if (first) {
        first = false;
      } else {
        output = "," + output;
      }
    }
    output = array[i] + output;
  }
  return output;
}

function removeComma(string) {
  return string.replace(/,/g, "");
}

function clear_entry() {
  if (
    previous.textContent.slice(0, -2) === current.textContent ||
    regexEquals.test(previous.textContent)
  ) {
    clear();
  } else {
    current.textContent = "0";
  }
}

function clear() {
  previous.textContent = "";
  current.textContent = "0";
  clickedDecimal = false;
  clickedOperator = false;
  count = 0;
}

function backspace() {
  if (regexExponential.test(current.textContent)) {
    current.textContent = "0";
    previous.textContent = "";
  } else {
    let currentText = current.textContent;

    if (currentText !== "0") {
      current.textContent = addPunctuation(
        removeComma(currentText.slice(0, -1))
      );
    }

    if (current.textContent === "") {
      current.textContent = "0";
    }
  }
}

function equals() {
  let operator = previous.textContent.slice(-1);

  if (operator !== "=") {
    previous.textContent += ` ${current.textContent} =`;
    compute(operator);
    count = 0;
  }
}
