import {Page, NavParams} from 'ionic-angular';
import {GameField} from "../../providers/game-field";


@Page({
    templateUrl: 'build/pages/game-play/game-play.html',
})
export class GamePlay {

    computerGameField: GameField;
    ownGameField: GameField;
    currentComputerShot = 1;

    constructor(private params: NavParams) {
        //create own game field
        this.ownGameField = params.get('ownGameField');

        //create computer game field
        this.computerGameField = params.get('computerGameField');
        console.log(params);

    }

    shoot(elem) {
        let id = elem.getAttribute('data-id');
        if(!this.computerGameField.shoot(id)) {
            return;
        }
        
        this.computerGameField.checkWinner();

        //TODO after currentComputerShot = 99
        this.ownGameField.shoot(this.currentComputerShot);
        this.currentComputerShot = this.increaseComputerShot();
    }

    increaseComputerShot() {
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
}