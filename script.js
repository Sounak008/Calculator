let num1, num2, operator;

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

function inputValue() {
  let input = document.getElementById("calculator-display").value;
  return input;
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    let input = inputValue();
    try {
      if (!/^[0-9+\-*/.]+$/.test(input)) {
      throw new Error("Invalid characters in input");
      }

      let result = null;
      let currentNumber = '';
      let currentOperator = null;

      for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (['+', '-', '*', '/'].includes(char)) {
        if (currentNumber !== '') {
        if (result === null) {
          result = parseFloat(currentNumber);
        } else if (currentOperator) {
          result = operate(result, currentOperator, parseFloat(currentNumber));
        }
        currentNumber = '';
        }
        currentOperator = char;
      } else {
        currentNumber += char;
      }
      }

      if (currentNumber !== '') {
      if (result === null) {
        result = parseFloat(currentNumber);
      } else if (currentOperator) {
        result = operate(result, currentOperator, parseFloat(currentNumber));
      }
      }
      document.getElementById("calculator-display").value = '';
      displayValue = result.toString();
      updateDisplay();
    } catch (error) {
      document.getElementById("calculator-display").value = '';
      displayValue = "Error: Invalid input";
      updateDisplay();
    }
  }
});

//Button stuff below:

let displayValue = '0';
const display = document.querySelector('#calculator-display');
let shouldResetDisplay = false;
function updateDisplay() {
  display.value = displayValue;
}
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
  } else if (button.textContent === '=') {
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
  } else if (button.id === 'clear-button') {
    button.addEventListener('click', () => {
      displayValue = '0';
      num1 = undefined;
      num2 = undefined;
      operator = undefined;
      shouldResetDisplay = false;
      updateDisplay();
    });
  } else if (button.id === 'backspace-button') {
    button.addEventListener('click', () => {
      displayValue = displayValue.slice(0, -1);
      updateDisplay();
    });
  }
});

function evaluateExpression(expression) {
  const tokens = [];
  let currentNumber = '';
  
  if (expression.startsWith('-')) {
    currentNumber = '-';
    expression = expression.substring(1);
  }
  
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
  
  if (currentNumber !== '') {
    tokens.push(parseFloat(currentNumber));
  }
  
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