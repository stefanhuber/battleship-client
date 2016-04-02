import {Page, NavController} from 'ionic-angular';
import * as interact from 'interact.js';
import {GamePlay} from "../game-play/game-play";


@Page({
    templateUrl: 'build/pages/game-setup/game-setup.html',
})
export class GameSetup {

    cells: Array<number> = [];
    originX: number;
    originY: number;
    cellSize: number;
    shipCount: number = 0;
    itemMoved: boolean = false;

    constructor(private nav: NavController) {
        for ( let i = 0; i < 100; i++ ) {
            this.cells.push(i);
        }
    }

    initShip($game: HTMLElement, type: number) {
        let $ship = document.createElement('div');
        $ship.className = 'ship ship-' + type;

        $ship.style.height = this.cellSize + 'px';
        $ship.style.width = (this.cellSize * type) + 'px';
        $ship.style.left = '0px';
        $ship.style.top = (this.cellSize * this.shipCount) + 'px';
        $ship.style.transformOrigin = this.cellSize / 2 + 'px' + this.cellSize / 2 + 'px';

        $ship.setAttribute('data-type', type.toString());
        $ship.setAttribute('data-x', 0);
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

    startGame() {

        let $shipElements = document.getElementsByClassName('ship');
        let ships = [];

        for ( let i = 0; i < $shipElements.length; i++ ) {
            let $shipElement = $shipElements.item(i);
            let ship = {
                orientation: $shipElement.classList.contains('rotate') ? 'vertical' : 'horizontal',
                type: $shipElement.getAttribute('data-type'),
                x: parseInt($shipElement.getAttribute('data-x')),
                y: parseInt($shipElement.getAttribute('data-y'))
            };

            // console.log("X: " + $shipElement.getBoundingClientRect().left / this.cellSize);
            // console.log("Y: " + $shipElement.getBoundingClientRect().top / this.cellSize);

            ships.push(ship);
        }

        this.nav.push(GamePlay, {
            ships: ships
        });
    }


    ngAfterContentInit() {

        let $game = document.getElementById('game');
        $game.style.height = $game.clientWidth + 'px';

        this.cellSize = $game.clientWidth / 10;
        this.originX = $game.getClientRects()[0].left;
        this.originY = $game.getClientRects()[0].top;

        let z = 4;
        for ( let i = 2; i <= 5; i++ ) {
            let j = 0;
            while ( j < z ) {
                this.initShip($game, i);
                j++;
            }
            z--;
        }

        interact('.ship')
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
                }
            });
    }

}
