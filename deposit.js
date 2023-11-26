//1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. give the user their winnings
// 7. play again

const prompt = require('prompt-sync')()

const ROWS = 3
const COLS = 3

const SYMBOLS_COUNT = {
	A: 2,
	B: 4,
	C: 6,
	D: 8,
}

const SYMBOLS_VALUES = {
	A: 5,
	B: 4,
	C: 3,
	D: 2,
}

// Gets the amount of deposit the user wants to bet on.

const deposit = () => {
	while (true) {
		const depositAmount = prompt('Enter a deposit amount: ')
		const numberDepositAmount = parseFloat(depositAmount)

		if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
			console.log('Invalid deposit amount, try again.')
		} else {
			return numberDepositAmount
		}
	}
}

// getting the number of Lines that the user bets on, by asking them to input the number.

const getNumberOfLines = () => {
	while (true) {
		const lines = prompt('Enter the munber of lines to bet on (1 -3): ')
		const numberOfLines = parseFloat(lines)

		if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines >= 3) {
			console.log('Invalid number of lines, try again.')
		} else {
			return numberOfLines
		}
	}
}

//get the bet amount perline based on the balance their have or number of lines their betting on.

const getBet = (balance, lines) => {
	while (true) {
		const bet = prompt('Enter the bet per line: ')
		const numberBet = parseFloat(bet)

		if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
			console.log('Invalid bet, try again.')
		} else {
			return numberBet
		}
	}
}

//Then the users need to spin the reels machine through getting the numbers of Symbols, cols and rows

const spin = () => {
	const symbols = []
	for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
		for (let i = 0; i < count; i++) {
			symbols.push(symbol)
		}
	}
	const reels = [[], [], []]
	for (let i = 0; i < COLS; i++) {
		const reelSymbols = [...symbols]
		for (let j = 0; j < ROWS; j++) {
			const randomIndex = Math.floor(Math.random() * reelSymbols.length)
			const selectedSymbols = reelSymbols[randomIndex]
			reels[i].push(selectedSymbols)
			reelSymbols.splice(randomIndex, 1)
		}
	}
	return reels
}


// We transpose, cause this kind of help converts all of our rows and cols in a better arrangement to check if the user won anything for easy print out function.
const transpose = (reels) => {
	const rows = []

	for (let i = 0; i < ROWS; i++) {
		rows.push([])
		for (let j = 0; j < COLS; j++) {
			rows[i].push(reels[j][i])
		}
	}
	return rows
}

//Printing the number of rows in a nice formatting for the users to better understand the stages of winnings
const printRows = (rows) => {
	for (const row of rows) {
		let rowString = ''
		for (const [i, symbol] of rows.entries()) {
			rowString += symbol
			if (i != rows.length - 1) {
				rowString += '|'
			}
		}
		console.log(rowString)
	}
}

// getting the winnings of the users per rows, bet and lines.

const getWinnings = (rows, bet, lines) => {
	let winnings = 0
	for (let row = 0; row < lines; row++) {
		const symbols = rows[row]
		let allSame = true

		for (const symbol of symbols) {
			if (symbol != symbols[0]) {
				allSame = false
				break
			}
		}
		if (allSame) {
			winnings += bet * SYMBOLS_VALUES[symbols[0]]
		}
	}
	return winnings
}


// Here is a function that performs a task were the user continues playing the games until he/she runs out of funds.
const game = () => {
	let balance = deposit()
	while (true) {
		console.log('You have a balance of $ ' + balance)
		const numberOfLines = getNumberOfLines()
		const bet = getBet(balance, numberOfLines)
		balance -= bet * numberOfLines
		const reels = spin()
		const rows = transpose(reels)
		// console.log(reels)
		// console.log(rows)
		printRows(rows)
		const winnings = getWinnings(rows, bet, numberOfLines)
		balance += winnings
		console.log('You won, $' + winnings.toString())

		if (balance <= 0) {
			console.log('You run out of money!')
			break
		}

		const playAgain = prompt('Do you want to play again (y/n)? ')

		if (playAgain != 'y') break
	}
}

game()
