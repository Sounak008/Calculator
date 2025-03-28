let num1, num2, operator;

// Basic math operations for calculator
// Each function handles a specific operation and rounds to 4 decimal places
// Returns a number, not a string, to allow for chained operations
function add(num1, num2) {
  return Number((num1 + num2).toFixed(4));
}

function subtract(num1, num2) {
  return Number((num1 - num2).toFixed(4));
}

function multiply(num1, num2) {
  return Number((num1 * num2).toFixed(4));
}

function divide(num1, num2) {
  if (num2 === 0) return 'Nahh bruh..really?';
  return Number((num1 / num2).toFixed(4));
}

// Takes two numbers and an operator, then performs the calculation
// Acts as a router to the appropriate math function based on operator
// Returns the result of the operation (number or error message)
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

// Display management variables
// Tracks what's shown on screen and whether it should reset on next input
// Used throughout the calculator logic to control the UI
let displayValue = '0';
const display = document.querySelector('#calculator-display');
let shouldResetDisplay = false;

// Updates the calculator display with current value
// Called whenever the displayValue changes
function updateDisplay() {
  display.value = displayValue;
}

// Initialize the display when page loads
window.onload = function () {
  updateDisplay();
};

// Get all buttons on the calculator for event handling
const digitButtons = document.querySelectorAll('.calculator-buttons button');

// Add event listeners to each button on the calculator
// Different handling based on button type (number, operator, equals, clear)
digitButtons.forEach((button) => {
  // Number and decimal point button handler
  // Handles appending digits and ensuring proper decimal point usage
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
  }
  // Operator button handler (+, -, *, /)
  // Adds operator to the display or replaces last operator if needed
  else if (
    button.textContent === '+' ||
    button.textContent === '-' ||
    button.textContent === '*' ||
    button.textContent === '/'
  ) {
    button.addEventListener('click', () => {
      if (['+', '-', '*', '/'].some(op => displayValue.endsWith(op))) {
        displayValue = displayValue.slice(0, -1) + button.textContent;
      } else {
        displayValue += button.textContent;
      }
      
      num1 = undefined;
      num2 = undefined;
      operator = button.textContent;
      shouldResetDisplay = false;
      updateDisplay();
    });
  }
  // Equals button handler
  // Evaluates the expression when pressed and displays the result
  else if (button.textContent === '=') {
    button.addEventListener('click', () => {
      try {
        let expression = displayValue;
        let result = evaluateExpression(expression);
        
        if (typeof result === 'string') {
          displayValue = result;
        } else {
          displayValue = result.toString();
        }
        
        num1 = undefined;
        num2 = undefined;
        operator = undefined;
        shouldResetDisplay = true;
        updateDisplay();
      } catch (error) {
        displayValue = 'Error';
        shouldResetDisplay = true;
        updateDisplay();
      }
    });
  }
  // Clear button handler
  // Resets the calculator to initial state
  else if (button.id === 'clear-button') {
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

// Parses a string expression and calculates the result
// Handles multi-operation expressions like "2+3*4"
// Returns the final calculated value
function evaluateExpression(expression) {
  const tokens = [];
  let currentNumber = '';
  
  // Handle negative numbers at the beginning of expression
  if (expression.startsWith('-')) {
    currentNumber = '-';
    expression = expression.substring(1);
  }
  
  // Tokenize the expression into numbers and operators
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    
    if (['+', '-', '*', '/'].includes(char)) {
      if (currentNumber !== '') {
        tokens.push(parseFloat(currentNumber));
        currentNumber = '';
      }
      tokens.push(char);
    } else {
      currentNumber += char;
    }
  }
  
  // Add the last number if there is one
  if (currentNumber !== '') {
    tokens.push(parseFloat(currentNumber));
  }
  
  // Calculate the result from left to right
  // This performs operations in order, not applying standard precedence
  let result = tokens[0];
  let currentOperator = null;
  
  for (let i = 1; i < tokens.length; i++) {
    if (typeof tokens[i] === 'string') {
      currentOperator = tokens[i];
    } else if (typeof tokens[i] === 'number' && currentOperator) {
      result = operate(result, currentOperator, tokens[i]);
      currentOperator = null;
    }
  }
  
  return result;
}