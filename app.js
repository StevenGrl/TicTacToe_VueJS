document.addEventListener('DOMContentLoaded', () => {
    const grid = new Vue({
        el: '#game',
        data: () => ({
            title: 'Tic Tac Toe V 1.1',
            winCombination: [],
            game: [],
            hits: 0,
            currentPlayerId: 0,
            playerOne: new Player(1),
            playerTwo: new Player(2),
            winner: null,
            errorMessage: null
        }),
        created: function() {
            this.createGame()
        },
        methods: {
            getCellClass(id) {
                return 
            },
            createGame() {
                this.game = new GameMap(3, 3, 3)
                this.hits = 0
                this.currentPlayerId = 1
                this.playerOne.cellsId = []
                this.playerTwo.cellsId = []
                this.winner = null
                this.errorMessage = null
            },
            play(rowIndex, cellIndex) {
                const cell = this.game.map[rowIndex][cellIndex]
                const currentPlayerCellsId = this.currentPlayerId === 1 ? this.playerOne.cellsId : this.playerTwo.cellsId
                if (this.winner !== null) {
                    this.errorMessage = 'The Game is finished, you have to launch a new game to play'
                    return
                }

                if (cell.clicked) {
                    this.errorMessage = 'You can\'t click here ! It\'s already clicked'
                    return
                }

                this.errorMessage = null

                cell.clicked = true
                cell.player = this.currentPlayerId

                currentPlayerCellsId.push(cell.id)

                if (++this.hits >= 5 && this.isWinner(currentPlayerCellsId)) {
                    this.winner = this.currentPlayerId
                    this.currentPlayerId === 1 ? this.playerOne.score++ : this.playerTwo.score++
                }

                this.errorMessage = this.hits === 9 && this.winner === null ? 'Nobody win this game :/' : null

                this.currentPlayerId = (this.currentPlayerId === 1) ? 2 : 1
            },
            isWinner(playerCellIds) {
                let win = false

                for (const combination of this.game.winCombinations) {
                    const matches = playerCellIds.filter(cellId => combination.includes(cellId))
                    win = matches.length === combination.length
                    if (win) {
                        this.winCombination = combination
                        break   
                    }
                }

                return win
            }
        }
    })
})

class GameMap {
    constructor(nbRow, nbCol, nbCellsToWin) {
        this.map = []
        this.winCombinations = []
        /* map generation */
        for (let rowIndex = 0; rowIndex < nbRow; rowIndex++) {
            const cells = []
            for (let cellIndex = 0; cellIndex < nbCol; cellIndex++) {
                const cellId = (cellIndex + 1) + (rowIndex * nbCol)
                const cell = new GameCell(cellId)
                cells.push(cell)
            }
            this.map.push(cells)
        }
        
        /* winCombinations generation */
        for (let nbRowIndex = 0; nbRowIndex < nbRow; nbRowIndex++) {
            let winCombinationRow = []
            let winCombinationCol = []
            for (let nbColIndex = 0; nbColIndex < nbCol; nbColIndex++) {
                winCombinationRow.push(this.map[nbRowIndex][nbColIndex].id)
                winCombinationCol.push(this.map[nbColIndex][nbRowIndex].id)
            }
            this.winCombinations.push(winCombinationRow)
            this.winCombinations.push(winCombinationCol)
        }

        let winCombinationDiagOne = []
        let winCombinationDiagTwo = []
        for (let diagIndex = 0; diagIndex < nbCellsToWin; diagIndex++) {
            winCombinationDiagOne.push(this.map[0 + diagIndex][diagIndex].id)
            winCombinationDiagTwo.push(this.map[diagIndex][(nbCellsToWin - 1) - diagIndex].id)
        }
        this.winCombinations.push(winCombinationDiagOne)
        this.winCombinations.push(winCombinationDiagTwo)
    }
}

class GameCell {
    constructor(id) {
        this.clicked = false
        this.player = null
        this.id = id
    }
}


class Player {
    constructor(id) {
        this.score = 0
        this.cellsId = []
        this.id = id
    }
}