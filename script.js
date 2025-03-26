let num1, num2, operator;

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

let displayValue = '0';
const display = document.querySelector('#calculator-display');
let shouldResetDisplay = false;

function updateDisplay() {
  display.value = displayValue;
}

window.onload = function () {
  updateDisplay();
};

const digitButtons = document.querySelectorAll('.calculator-buttons button');

digitButtons.forEach((button) => {
  if (!isNaN(button.textContent) || button.textContent === '.') {
    button.addEventListener('click', () => {
      if (displayValue === '0' || shouldResetDisplay) {
        displayValue = button.textContent;
        shouldResetDisplay = false;
      } else {
        if (button.textContent === '.') {
          const lastOperator = ['+', '-', '*', '/'].reduce((last, op) => {
            const index = displayValue.lastIndexOf(op);
            return index > last ? index : last;
          }, -1);
          
          const currentNumber = lastOperator >= 0 ? displayValue.substring(lastOperator + 1) : displayValue;
          
          if (currentNumber.includes('.')) {
            return;
          }
        }
        
        displayValue += button.textContent;
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
        displayValue = displayValue.slice(0, -1) + button.textContent;
      } else if (num1 !== undefined && operator !== undefined) {
        const operatorIndex = displayValue.lastIndexOf(operator);
        num2 = parseFloat(displayValue.substring(operatorIndex + 1));
        const result = operate(num1, operator, num2);

        displayValue = result.toString() + button.textContent;
        num1 = result;
      } else {
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
    });
  }
});