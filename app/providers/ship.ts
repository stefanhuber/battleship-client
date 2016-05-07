import {Injectable} from "angular2/core";


@Injectable()
export class Ship {

    HORIZONTAL: string = 'horizontal';
    VERTICAL: string = 'vertical';


    orientation: string;
    type: number;
    x: number;
    y: number;


    constructor(type, orientation = null, x = null, y = null) {
        this.type = type;

        if (orientation === null) {
            orientation = (this.getRandom(0, 9) % 2) ? this.HORIZONTAL : this.VERTICAL;
        }
        this.orientation = orientation;

        if (x === null) {
            let maxPosition = 9;
            if (orientation == this.HORIZONTAL) {
                maxPosition -= type;
            }
            x = this.getRandom(0, maxPosition);
        }
        this.x = x;

        if (y === null) {
            let maxPosition = 9;
            if (orientation == this.VERTICAL) {
                maxPosition -= type;
            }
            y = this.getRandom(0, maxPosition);
        }
        this.y = y;
    }

    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


}