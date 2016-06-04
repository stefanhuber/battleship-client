import {Page, NavController} from 'ionic-angular';
import * as interact from 'interact.js';
import {Game2Play} from "../game-2-play/game-2-play";
import {GamePlay} from "../game-play/game-play";
import {Ship} from "../../providers/ship";
import {GameField} from "../../providers/game-field";
import * as io from 'socket.io-client';

@Page({
    templateUrl: 'build/pages/game-setup/game-setup.html',
})
export class GameSetup {

    cells: Array<number> = [];
    originX: number;
    originY: number;
    cellSize: number;
    shipCount: number = 0;
    
    constructor(private nav: NavController) {
        for ( let i = 0; i < 100; i++ ) {
            this.cells.push(i);
        }        
    }
    
    start2Game() {
        let socket = io('http://192.168.23.100:8085');
        
        socket.on('session', message => {
            if (message.p1 === socket.id) {
                this.nav.push(Game2Play, {
                    player : 1 ,
                    sessionId : message.sessionId ,
                    gameField : this.getOwnGameField()
                });
            } else if (message.p2 === socket.id) {
                this.nav.push(Game2Play, {
                    player : 2 ,
                    sessionId : message.sessionId ,
                    gameField : this.getOwnGameField()
                });
            }            
        });
    }

    initShip($game: HTMLElement, type: number) {
        let $ship = document.createElement('div');
        $ship.className = 'm-game-ship m-game-ship-' + type;

        $ship.style.height = this.cellSize + 'px';
        $ship.style.width = (this.cellSize * type) + 'px';
        $ship.style.left = '0px';
        $ship.style.top = (this.cellSize * this.shipCount) + 'px';
        $ship.style.transformOrigin = this.cellSize / 2 + 'px ' + this.cellSize / 2 + 'px';

        $ship.setAttribute('data-type', type.toString());
        $ship.setAttribute('data-x', "0");
        $ship.setAttribute('data-y', this.shipCount.toString());

        $ship.addEventListener('touchstart', () => {
            $ship.setAttribute('data-move', 'false');
        });
        $ship.addEventListener('touchend', () => {
            if ($ship.getAttribute('data-move') === 'false') {
                $ship.classList.toggle('rotate');
            }

            $ship.setAttribute('data-x', Math.round(parseFloat($ship.style.left) / this.cellSize).toString());
            $ship.setAttribute('data-y', Math.round(parseFloat($ship.style.top) / this.cellSize).toString());

        });

        $game.appendChild($ship);
        this.shipCount++;
    }
    
    getOwnGameField() : GameField {
        let $shipElements = document.getElementsByClassName('m-game-ship');
        let ownShips = [];

        for ( let i = 0; i < $shipElements.length; i++ ) {
            let $shipElement = $shipElements.item(i);
            let ship = new Ship(
                $shipElement.getAttribute('data-type'),
                $shipElement.classList.contains('rotate') ? 'vertical' : 'horizontal',
                parseInt($shipElement.getAttribute('data-x')),
                parseInt($shipElement.getAttribute('data-y'))
            );

            ownShips.push(ship);
        }
        
        return new GameField(ownShips);
    } 

    /**
     * starts a new Game
     *  - loads all ships in ships object
     *  - ship contains type (eg 2, 3), orientation (eg horizontal), position (x, y)
     */
    startGame() {
        this.nav.push(GamePlay, {
            ownGameField: this.getOwnGameField(),
            computerGameField: this.generateComputerShips()
        });
    }

    generateComputerShips() : GameField {
        let computerGameField = new GameField([]);

        let numberOfShips = 1;
        let numOfShip = 0;
        for ( let shipLength = 5; shipLength >= 2; shipLength-- ) {
            let j = 0;
            while ( j < numberOfShips ) {

                do {
                    var ship = new Ship(shipLength);
                } while ( computerGameField.addShip(ship) === false );

                j++;
                numOfShip++;
            }
            numberOfShips++;
        }
        
        return computerGameField;
    }


    ngAfterContentInit() {

        let $game = document.getElementById('m-game');
        $game.style.height = $game.clientWidth + 'px';

        this.cellSize = $game.clientWidth / 10;
        this.originX = $game.getClientRects()[0].left;
        this.originY = $game.getClientRects()[0].top;

        let numberOfShips = 4;
        for ( let shipLength = 2; shipLength <= 5; shipLength++ ) {
            let j = 0;
            while ( j < numberOfShips ) {
                this.initShip($game, shipLength);
                j++;
            }
            numberOfShips--;
        }

        interact('.m-game-ship')
            .draggable({
                snap: {
                    targets: [
                        interact.createSnapGrid({
                            x: this.cellSize,
                            y: this.cellSize,
                            offset: {
                                x: this.originX,
                                y: this.originY
                            }
                        })
                    ]
                },
                onmove: (event) => {
                    event.target.setAttribute('data-move', true);
                    event.target.style.left = (event.pageX - this.originX) + 'px';
                    event.target.style.top = (event.pageY - this.originY) + 'px';
                },
                restrict: {
                    drag: "parent",
                    elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                }
            });
    }

}
