import {Page, NavParams, NavController} from 'ionic-angular';
import {GameField} from "../../providers/game-field";
import {GameWinner} from "../game-winner/game-winner";


@Page({
    templateUrl: 'build/pages/game-play/game-play.html',
})
export class GamePlay {

    computerGameField: GameField;
    ownGameField: GameField;
    currentComputerShot = 1;

    constructor(private params: NavParams, private nav: NavController) {
        //create own game field
        this.ownGameField = params.get('ownGameField');

        //create computer game field
        this.computerGameField = params.get('computerGameField');
    }

    shoot(elem) {
        let id = elem.getAttribute('data-id');
        if(!this.computerGameField.shoot(id)) {
            return;
        }
        
        
        if(this.computerGameField.checkWinner()) {
            this.nav.push(GameWinner, {
                winner: 'Spieler'
            });
        }

        //TODO after currentComputerShot = 99
        this.ownGameField.shoot(this.currentComputerShot);
        if(this.ownGameField.checkWinner()) {
            this.nav.push(GameWinner, {
                winner: 'Computer'
            });
        }

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