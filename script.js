const screen = document.getElementById('screen');
const historyPanel = document.getElementById('history-panel');
const historyLog = document.getElementById('history-log');

// Array to store history items
let calculationHistory = [];

// Append numbers or operators to the screen
function appendValue(value) {
    if (screen.value === "Error") {
        clearScreen();
    }
    screen.value += value;
}

// Clear the entire screen
function clearScreen() {
    screen.value = '';
}

// Delete the last character (Backspace)
function backspace() {
    if (screen.value === "Error") {
        clearScreen();
    } else {
        screen.value = screen.value.slice(0, -1);
    }
}

// Evaluate the expression safely
function calculate() {
    try {
        const currentExpr = screen.value;
        if (currentExpr !== "" && currentExpr !== "Error") {
            // Evaluate safely using Function constructor instead of eval()
            const result = Function(`"use strict"; return (${currentExpr})`)();
            
            if (result !== undefined && !isNaN(result)) {
                // Add to history list array
                addHistoryItem(currentExpr, result);
                screen.value = result;
            } else {
                throw new Error();
            }
        }
    } catch (error) {
        screen.value = "Error";
        setTimeout(clearScreen, 1500); // Clears the error after 1.5s
    }
}

// History Feature Logic
function toggleHistory() {
    historyPanel.classList.toggle('hidden');
}

function addHistoryItem(expression, result) {
    calculationHistory.push({ expr: expression, res: result });
    renderHistory();
}

function renderHistory() {
    if (calculationHistory.length === 0) {
        historyLog.innerHTML = '<p class="empty-msg">No history yet</p>';
        return;
    }

    historyLog.innerHTML = '';
    calculationHistory.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'history-item';
        itemDiv.innerHTML = `
            <div class="history-expr">${item.expr}</div>
            <div class="history-res">${item.res}</div>
        `;
        // Clicking a history entry loads its result back onto screen
        itemDiv.onclick = () => {
            screen.value = item.res;
            toggleHistory();
        };
        historyLog.appendChild(itemDiv);
    });
}

function clearHistory() {
    calculationHistory = [];
    renderHistory();
}

/* Theme Toggle Functionality */
function toggleTheme(){
    document.body.classList.toggle("light");
    const themeBtn = document.querySelector(".theme-btn");

    if (document.body.classList.contains("light")){
        themeBtn.innerHTML = "☀️";
    } else {
        themeBtn.innerHTML = "🌙";
    }
}

// Keyboard Support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Numbers and basic operators
    if ((key >= '0' && key <= '9') || ['+', '-', '*', '/', '.'].includes(key)) {
        appendValue(key);
    }
    // Enter key triggers calculation
    else if (key === 'Enter' || key === '=') {
        event.preventDefault(); 
        calculate();
    }
    // Backspace triggers deletion
    else if (key === 'Backspace') {
        backspace();
    }
    // Escape triggers clear
    else if (key === 'Escape') {
        clearScreen();
    }
});