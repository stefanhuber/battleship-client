import {Injectable} from "angular2/core";


@Injectable()
export class GameField {
    cells: Array<string> = [];

    EMPTY: string = 'is-empty';
    SHIP: string = 'is-ship';
    HIT: string = 'is-hit';
    MISSED: string = 'is-missed';


    constructor(ships: Array<any>) {
        for ( let i = 0; i < 100; i++ ) {
            this.cells.push(this.EMPTY);
        }
        this.addShips(ships);
    }


    addShips(ships: Array<any>) {
        for ( var index in ships ) {
            this.paintShip(ships[index]);
        }
    }

    paintShip(ship: Object) {
        let startX: number = ship['x'];
        let startY: number = ship['y'];
        let length: number = ship['type'];
        let alignment: string = ship['orientation'];

        let startCell = startX + (startY * 10);
        for ( let i = 0; i < length; i++ ) {
            if (alignment == 'horizontal') {
                this.cells[startCell + i] = this.SHIP;
            } else {
                this.cells[startCell + (i * 10)] = this.SHIP;
            }
        }
    }

    shoot(fieldNummer: number): boolean {
        if(fieldNummer >= this.cells.length) {
            return;
        }
        if (this.cells[fieldNummer] == this.SHIP) {
            this.cells[fieldNummer] = this.HIT;
            return true;
        } else if (this.cells[fieldNummer] == this.EMPTY) {
            this.cells[fieldNummer] = this.MISSED;
            return true;
        } else {
            return false;
        }
    }

    checkWinner() {
        let self = this;
        if(this.cells.find((e) => this._gameFieldContainsShips(e))) {

        } else {
            console.log('winner found');
        }
    }

    _gameFieldContainsShips(elem) {
        return elem.indexOf(this.SHIP) > -1;
    }

}