let num1, num2, operator;

// Basic arithmetic functions
function add(num1, num2) {
  let value = (num1 + num2);
  return value.toFixed(4);
}

function subtract(num1, num2) {
  let value = (num1 - num2);
  return value.toFixed(4);
}

function multiply(num1, num2) {
  let value = (num1 * num2);
  return value.toFixed(4);
}

function divide(num1, num2) {
  if (num2 === 0) return 'Nahh bruh..really?';
  let value = (num1 / num2);
  return value.toFixed(4);
}

// Function to perform the operation based on the operator
function operate(num1, operator, num2) {
  switch (operator) {
    case '+':
      return add(num1, num2);
    case '-':
      return subtract(num1, num2);
    case '*':
      return multiply(num1, num2);
    case '/':
      return divide(num1, num2);
    default:
      return 'Invalid operator';
  }
}

// Initialize display value and reset flag
let displayValue = '0';
const display = document.querySelector('#calculator-display');
let shouldResetDisplay = false;

// Function to update the calculator display
function updateDisplay() {
  display.value = displayValue;
}

// Initialize display on page load
window.onload = function () {
  updateDisplay();
};

// Add event listeners to all calculator buttons
const digitButtons = document.querySelectorAll('.calculator-buttons button');

digitButtons.forEach((button) => {
  if (!isNaN(button.textContent) || button.textContent === '.') {
    button.addEventListener('click', () => {
      if (shouldResetDisplay || displayValue === '0') {
        displayValue = button.textContent;
        shouldResetDisplay = false;
      } else {
        if (button.textContent === '.' && displayValue.includes('.')) {
          button.disabled = true;
          button.style.pointerEvents = 'none';
          button.style.backgroundColor = '#4A4B50';
          button.style.boxShadow = 'none';
          button.style.color = '#7A7A7A';
        } else {
          displayValue += button.textContent;
        }
      }
      updateDisplay();
    });
  } else if (
    button.textContent === '+' ||
    button.textContent === '-' ||
    button.textContent === '*' ||
    button.textContent === '/'
  ) {
    button.addEventListener('click', () => {
      if (operator && displayValue.endsWith(operator)) {
        // Replace the last operator if consecutive operators are pressed
        displayValue = displayValue.slice(0, -1) + button.textContent;
      } else if (num1 !== undefined && operator !== undefined) {
        // If an operation is already in progress, calculate the result
        const operatorIndex = displayValue.lastIndexOf(operator);
        num2 = parseFloat(displayValue.substring(operatorIndex + 1));
        const result = operate(num1, operator, num2);

        // Update display with the result and append the new operator
        displayValue = result.toString() + button.textContent;
        num1 = result;
      } else {
        // Store the first number and append the operator
        num1 = parseFloat(displayValue);
        displayValue += button.textContent;
      }

      operator = button.textContent;
      shouldResetDisplay = false;
      updateDisplay();
    });
  } else if (button.textContent === '=') {
    button.addEventListener('click', () => {
      if (num1 !== undefined && operator !== undefined) {
        const operatorIndex = displayValue.lastIndexOf(operator);
        num2 = parseFloat(displayValue.substring(operatorIndex + 1));
        const result = operate(num1, operator, num2);

        displayValue = result.toString();
        num1 = undefined;
        operator = undefined;
        shouldResetDisplay = true;
        updateDisplay();
      }
    });
  } else if (button.id === 'clear-button') {
    button.addEventListener('click', () => {
      displayValue = '0';
      num1 = undefined;
      num2 = undefined;
      operator = undefined;
      shouldResetDisplay = false;
      updateDisplay();

      const decimalButton = Array.from(digitButtons).find(
        (btn) => btn.textContent === '.'
      );
      if (decimalButton) {
        decimalButton.disabled = false;
        decimalButton.style.pointerEvents = '';
        decimalButton.style.backgroundColor = '';
        decimalButton.style.boxShadow = '';
        decimalButton.style.color = '';
      }
    });
  }
});