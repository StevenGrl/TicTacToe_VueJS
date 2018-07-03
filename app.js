document.addEventListener('DOMContentLoaded', () => {
    const grid = new Vue({
        el: '#game',
        data: () => ({
            title: 'Tic Tac Toe V 1.0',
            winCombinations: [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ], [ 1, 4, 7 ], [ 2, 5, 8 ], [ 3, 6, 9 ], [ 1, 5, 9 ], [ 7, 5, 3 ] ],
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
            createGame() {
                this.game = new GameMap(3, 3)
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

                for (const combination of this.winCombinations) {
                    const matches = playerCellIds.filter(cellId => combination.includes(cellId))
                    win = matches.length === combination.length
                    if (win) break
                }

                return win
            }
        }
    })
})

class GameMap {
    constructor(width, height) {
        this.map = []
        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            const cells = []
            for (let cellIndex = 0; cellIndex < width; cellIndex++) {
                const cellId = (cellIndex + 1) + (rowIndex * width)
                const cell = new GameCell(cellId)
                cells.push(cell)
            }
            this.map.push(cells)
        }
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