import {Page, NavParams, NavController} from 'ionic-angular';
import {GameField} from "../../providers/game-field";
import {GameWinner} from "../game-winner/game-winner";


@Page({
    templateUrl: 'build/pages/game-play/game-play.html',
})
export class GamePlay {

    computerGameField: GameField;
    ownGameField: GameField;
    currentComputerShot: number = 1;
    numOfComputerShots: number = 0;

    constructor(private params: NavParams, private nav: NavController) {
        //create own game field
        this.ownGameField = params.get('ownGameField');

        //create computer game field
        this.computerGameField = params.get('computerGameField');
    }

    shoot(elem) {
        let id = elem.getAttribute('data-id');
        if (!this.computerGameField.shoot(id)) {
            return;
        }


        if (this.computerGameField.checkWinner()) {
            this.nav.push(GameWinner, {
                winner: 'Spieler'
            });
        }
        
        if (this.numOfComputerShots + 1 > this.ownGameField.cells.length / 2) {
            while ( !this.ownGameField.shoot(this._randomComputerShot()) ) {
            }
        } else {
            this.ownGameField.shoot(this.currentComputerShot);
            this.currentComputerShot = this._increaseComputerShot();
        }

        this.numOfComputerShots++;

        if (this.ownGameField.checkWinner()) {
            this.nav.push(GameWinner, {
                winner: 'Computer'
            });
        }


    }

    _increaseComputerShot() {
        let nextComputerShot = this.currentComputerShot += 1;

        if (nextComputerShot % 10 == 0) {
            return nextComputerShot;
        } else if ((nextComputerShot % 10 ) % 2 == 1 && nextComputerShot % 10 == 9) {
            nextComputerShot += 2;
        } else {
            nextComputerShot++;
        }

        return nextComputerShot;
    }

    _randomComputerShot(): number {
        return this.getRandom(0, 99);
    }

    getRandom(min, max): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}