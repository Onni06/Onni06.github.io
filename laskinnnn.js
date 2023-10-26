const inputField = document.getElementById('inputPassword');
const previousOperandTextElement = document.querySelector('[data-previousoperand]');
const currentOperandTextElement = document.querySelector('[data-currentoperand]');
const operationButtons = document.querySelectorAll('.data-operation');
const numberButtons = document.querySelectorAll('.btn-primary');

let currentOperand = '';
let previousOperand = '';
let operation = undefined;

// Lisätään klikkikuuntelijat numero- ja operaatiopainikkeille
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.innerText);
        updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        setOperation(button.innerText);
        updateDisplay();
    });
});

// Funktio numeropainikkeiden käsittelyä varten
function appendNumber(number) {
    currentOperand = currentOperand.toString() + number.toString();
}

// Funktio operaatioiden asettamiseen
function setOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        compute();
    }
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
}

// Funktio laskutoimituksen suorittamiseen
function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            computation = prev / current;
            break;
        default:
            return;
    }
    currentOperand = computation;
    operation = undefined;
    previousOperand = '';
}

// Päivitetään näyttö
function updateDisplay() {
    currentOperandTextElement.innerText = currentOperand;
    if (operation != null) {
        previousOperandTextElement.innerText = `${previousOperand} ${operation}`;
    } else {
        previousOperandTextElement.innerText = '';
    }
}

// Lisätään toiminnallisuus "C"-painikkeelle (tyhjennä)
document.querySelector('.btn-primary:nth-child(15)').addEventListener('click', () => {
    clear();
    updateDisplay();
});

// Tyhjennetään laskimen arvot
function clear() {
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
}

// Kuunnellaan '='-painiketta laskun suorittamiseksi
document.querySelector('.btn-primary:nth-child(14)').addEventListener('click', () => {
    compute();
    updateDisplay();
});
