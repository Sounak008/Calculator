let num1, num2, operator;

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
  if (num2 === 0)
    return 'Cannot divide by zero';
  return num1 / num2;
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

// Initialize with "0" instead of empty string
let displayValue = '0';
const display = document.querySelector('#calculator-display');
let shouldResetDisplay = false;

function updateDisplay() {
    display.value = displayValue;
}

// Initialize display when page loads
window.onload = function() {
    updateDisplay();
};

const digitButtons = document.querySelectorAll('.calculator-buttons button');
digitButtons.forEach(button => {
    if (!isNaN(button.textContent) || button.textContent === '.') {
        button.addEventListener('click', () => {
            if (shouldResetDisplay || displayValue === '0') {
                // Replace "0" with the clicked digit (don't append to 0)
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
    } else if (button.textContent === '+' || button.textContent === '-' || 
               button.textContent === '*' || button.textContent === '/') {
        button.addEventListener('click', () => {
            num1 = parseFloat(displayValue);
            operator = button.textContent;
            
            displayValue += operator;
            updateDisplay();
            
            shouldResetDisplay = false;
        });
    } else if (button.textContent === '=') {
        button.addEventListener('click', () => {
            const operatorIndex = displayValue.lastIndexOf(operator);
            num2 = parseFloat(displayValue.substring(operatorIndex + 1));
            
            const result = operate(num1, operator, num2);
            
            displayValue = result.toString();
            updateDisplay();
            
            shouldResetDisplay = true;
        });
    } else if (button.id === 'clear-button') {
        button.addEventListener('click', () => {
            // Set to "0" instead of empty string
            displayValue = '0';
            num1 = undefined;
            num2 = undefined;
            operator = undefined;
            shouldResetDisplay = false;
            updateDisplay();
            
            const decimalButton = Array.from(digitButtons).find(btn => btn.textContent === '.');
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