let displayVal = '0';
let currentOperator;
let arg1;

document.querySelectorAll('button.number')
  .forEach(btn => {
    btn.addEventListener('click', (e) => {
      handleInput(e.target.textContent);
    });
  });

document.querySelectorAll('button.operator')
  .forEach(btn => {
    btn.addEventListener('click', (e) => {
      handleOperator(e.target.textContent);
    });
  });

document.querySelector('#equal-btn')
  .addEventListener('click', evaluate);

document.querySelector('#clear-btn')
  .addEventListener('click', clear);

document.querySelector('#del-btn')
  .addEventListener('click', backspace);

window.addEventListener('keydown', (e) => {
  const key = e.key;

  if (isNumber(key)) handleInput(key);

  if (isOperator(key)) handleOperator(key);

  if (key === '=' || key === 'Enter') evaluate();

  if (key === 'Escape') clear();

  if (key === 'Backspace') backspace();
});

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('divide-by-zero');
  }
  return a / b;
}

function operate(a, b, operator) {
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    default:
      throw new Error(`Error: "${operator}" not a valid operator`);
  }
}

function handleInput(value) {
  if (value === '.' && displayVal.includes(value)) return;

  displayVal = displayVal === '0' && value !== '.' ? value : displayVal + value;

  if (!displayVal.includes('.') && displayVal.length > 3) {
    const numberVal = parseValue(displayVal);
    displayVal = formatValue(numberVal);
  }

  document.querySelector('.display .input').textContent = displayVal;
}

function handleOperator(operator) {
  try {
    if (currentOperator) {
      const arg2 = parseValue(displayVal);
      const result = operate(arg1, arg2, currentOperator);
      arg1 = result;
    } else {
      arg1 = parseValue(displayVal);
    }
  
    currentOperator = operator;
    displayVal = '0';
    document.querySelector('.display .input').textContent = displayVal;
    document.querySelector('.display .equation').textContent = `${formatValue(arg1)} ${currentOperator}`;
  } catch (error) {
    handleError(error);
  }
}

function evaluate() {
  if (!(arg1 && currentOperator)) return;

  try {
    const arg2 = parseValue(displayVal);
    const result = operate(arg1, arg2, currentOperator);
    displayVal = formatValue(result);
    arg1 = currentOperator = undefined;
    document.querySelector('.display .input').textContent = displayVal;
    document.querySelector('.display .equation').textContent = '';
  } catch (error) {
    handleError(error);
  }
}

function clear() {
  displayVal = '0';
  arg1 = currentOperator = undefined;
  document.querySelector('.display .input').textContent = displayVal;
  document.querySelector('.display .equation').textContent = '';
}

function backspace() {
  displayVal = displayVal.slice(0, -1);

  if (!displayVal.includes('.') && displayVal.length > 3) {
    const numberVal = parseValue(displayVal);
    displayVal = formatValue(numberVal);
  }

  document.querySelector('.display .input').textContent = displayVal;
}

function parseValue(numberString) {
  return parseFloat(numberString.replaceAll(',', ''));
}

function formatValue(number) {
  return new Intl.NumberFormat('en-US').format(number);
}

function isNumber(value) {
  const numberRegex = /[^0-9\.]/;
  return !numberRegex.test(value);
}

function isOperator(value) {
  const operatorRegex = /[^\+\-\*\/]/;
  return !operatorRegex.test(value);
}

function handleError(error) {
  if (error.message === 'divide-by-zero') {
    const unravel = confirm('Are you trying to unravel the universe?');
    if (unravel) {
      alert('Well, knock it off!');
    } else {
      alert('Then stop trying to divide by zero you silly goose.');
    }
  } else {
    alert(error.message);
  }
}
