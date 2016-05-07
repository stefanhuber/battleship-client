import {Injectable} from "angular2/core";
import {Ship} from "./ship";


@Injectable()
export class GameField {
    cells: Array<string> = [];

    EMPTY: string = 'is-empty';
    HAS_SHIP: string = 'is-ship';
    IS_HIT: string = 'is-hit';
    IS_MISSED: string = 'is-missed';


    constructor(ships: Array<Ship>) {
        for ( let i = 0; i < 100; i++ ) {
            this.cells.push(this.EMPTY);
        }
        this.addShips(ships);
    }

    /**
     * tries to add a ship to gamefield
     *  - if gamefield already contains ship on this position returns false
     *  - if ship was added to gamefield returns true
     * @returns {boolean}
     */
    addShip(ship: Ship): boolean {

        let elem = 0;
        for ( let i = 0; i < ship.type; i++ ) {

            if (ship.orientation == ship.VERTICAL) {
                elem = ship.x + ship.y * 10;
            } else {
                elem = ship.x + i;
            }
            //TODO: stuff
            if (this._gameFieldContainsShips(elem)) {
                return false;
            }
        }
        this.paintShip(ship);

        return true;
    }


    addShips(ships: Array<Ship>) {
        for ( var index in ships ) {
            this.paintShip(ships[index]);
        }
    }

    paintShip(ship: Ship) {
        let startX: number = ship.x;
        let startY: number = ship.y;
        let length: number = ship.type;
        let alignment: string = ship.orientation;

        let startCell = startX + (startY * 10);
        for ( let i = 0; i < length; i++ ) {
            if (alignment == ship.HORIZONTAL) {
                this.cells[startCell + i] = this.HAS_SHIP;
            } else {
                this.cells[startCell + (i * 10)] = this.HAS_SHIP;
            }
        }
    }

    shoot(fieldNummer: number): boolean {
        if (fieldNummer >= this.cells.length) {
            return;
        }
        if (this.cells[fieldNummer] == this.HAS_SHIP) {
            this.cells[fieldNummer] = this.IS_HIT;
            return true;
        } else if (this.cells[fieldNummer] == this.EMPTY) {
            this.cells[fieldNummer] = this.IS_MISSED;
            return true;
        } else {
            return false;
        }
    }

    checkWinner() {
        let self = this;
        if (this.cells.find((e) => this._gameFieldContainsShips(e))) {

        } else {
            console.log('winner found');
        }
    }

    _gameFieldContainsShips(elem) {
        return this.cells[elem].indexOf(this.HAS_SHIP) > -1;
    }

}