let num1, num2, operator;

// Basic arithmetic functions
function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  if (num2 === 0) return 'Cannot divide by zero';
  return num1 / num2;
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
  // Handle digit and decimal point buttons
  if (!isNaN(button.textContent) || button.textContent === '.') {
    button.addEventListener('click', () => {
      // Replace display value if reset is needed or if it's the default "0"
      if (shouldResetDisplay || displayValue === '0') {
        displayValue = button.textContent;
        shouldResetDisplay = false;
      } else {
        // Prevent multiple decimal points
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

  // Handle operator buttons (+, -, *, /)
  } else if (
    button.textContent === '+' ||
    button.textContent === '-' ||
    button.textContent === '*' ||
    button.textContent === '/'
  ) {
    button.addEventListener('click', () => {
      // If an operation is already in progress, calculate the result
      if (num1 !== undefined && operator !== undefined) {
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

  // Handle equals button (=)
  } else if (button.textContent === '=') {
    button.addEventListener('click', () => {
      // Perform the calculation if an operation is in progress
      if (num1 !== undefined && operator !== undefined) {
        const operatorIndex = displayValue.lastIndexOf(operator);
        num2 = parseFloat(displayValue.substring(operatorIndex + 1));
        const result = operate(num1, operator, num2);

        // Update display with the result and reset for a new calculation
        displayValue = result.toString();
        num1 = undefined;
        operator = undefined;
        shouldResetDisplay = true;
        updateDisplay();
      }
    });

  // Handle clear button (C)
  } else if (button.id === 'clear-button') {
    button.addEventListener('click', () => {
      // Reset all values to their initial state
      displayValue = '0';
      num1 = undefined;
      num2 = undefined;
      operator = undefined;
      shouldResetDisplay = false;
      updateDisplay();

      // Re-enable the decimal button if it was disabled
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