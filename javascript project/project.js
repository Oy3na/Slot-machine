// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Determine if the user won or lost
// 6. Update the user's balance
// 7. Play again or cash out
const prompt = require('prompt-sync')();

// Constants defining the slot machine grid size
const ROWS = 3; // Number of rows in the slot machine
const COLS = 3; // Number of columns in the slot machine

// Define the number of occurrences for each symbol in the slot machine
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
};

// Define the payout values for each symbol
const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
};

// Function to prompt the user to enter a deposit amount
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        // Validate deposit amount
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Please enter a valid deposit amount.");
        } else {
            return numberDepositAmount;
        }
    }
};

// Function to get the number of lines the user wants to bet on
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        // Validate number of lines
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Please enter a valid number of lines.");
        } else {
            return numberOfLines;
        }
    }
};

// Function to get the bet amount per line
const getBet = (balance, lines) => {
    while (true) {
        const betAmount = prompt("Enter the bet amount per line: ");
        const numberBetAmount = parseFloat(betAmount);

        // Validate bet amount
        if (isNaN(numberBetAmount) || numberBetAmount <= 0 || numberBetAmount > balance / lines) {
            console.log("Please enter a valid bet amount.");
        } else {
            return numberBetAmount;
        }
    }
};

// Function to simulate spinning the slot machine
const spin = () => {
    const result = [];
    
    // Create an array containing all symbols based on their count
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            result.push(symbol);
        }
    }
    
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...result]; // Copy symbols for each column
        
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1); // Remove selected symbol
        }
    }
    return reels;
};

// Function to transpose the reels (convert columns to rows)
const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

// Function to display the slot machine results
const checkWin = (rows) => {
    for (const row of rows) {
        console.log(row.join(" | "));
    }
};

// Function to calculate winnings based on matching symbols
const getWinningAmount = (rows, betAmount, lines) => {
    let winningAmount = 0;
    
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        
        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }
        
        if (allSame) {
            winningAmount += betAmount * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winningAmount;
};

// Main game function
const game = () => {
    let balance = deposit();

    while (true) {
        console.log(`Your balance is $${balance}`);
        const numberOfLines = getNumberOfLines();
        const betAmount = getBet(balance, numberOfLines);
        
        balance -= betAmount * numberOfLines;
        
        const reels = spin();
        const rows = transpose(reels);
        
        checkWin(rows);
        
        const winningAmount = getWinningAmount(rows, betAmount, numberOfLines);
        balance += winningAmount;
        
        console.log(`You won $${winningAmount}`);

        // Check if player has run out of money
        if (balance <= 0) {
            console.log("Game over! You have no money left.");
            break;
        }

        // Ask if the player wants to continue
        const playAgain = prompt("Do you want to play again (y/n)? ");
        if (playAgain.toLowerCase() !== "y") {
            console.log(`You are leaving the game with $${balance}`);
            break;
        }
    }
};

// Start the game
game();
