import {ChangeDetectorRef} from 'angular2/core';
import {Page, NavParams, NavController} from 'ionic-angular';
import {GameField} from "../../providers/game-field";
import {GameWinner} from "../game-winner/game-winner";
import * as io from 'socket.io-client';

@Page({
    templateUrl: 'build/pages/game-play/game-play.html',
})
export class Game2Play {
    
    player:number;
    opponent:number;
    isTurn:boolean;
    
    computerGameField: GameField;
    ownGameField: GameField;
    currentComputerShot: number = 1;
    numOfComputerShots: number = 0;
    session:SocketIOClient.Socket;

    constructor(private change: ChangeDetectorRef, private params: NavParams, private nav: NavController) {        
        this.ownGameField = params.get('gameField');
        this.computerGameField = new GameField([]);
        this.player = params.get('player');
        this.opponent = (this.player == 1 ? 2 : 1);
        this.isTurn = this.player == 1;
        
        this.session = io('http://192.168.23.100:8085/'+params.get('sessionId'));   
       
        this.session.on('game-start', () => {
            this.session.emit('init-'+this.player, this.ownGameField.cells);
        });
        
        this.session.on('init-'+this.opponent, message => {
            console.log(this.opponent,message);
            this.computerGameField.cells = message;
            this.change.detectChanges();    
        });
        
        this.session.on('turn-'+this.opponent, message => {
            this.ownGameField.shoot(message);
            this.isTurn = true;
        });           
    }

    shoot(elem) {
        if (this.isTurn) {
            let id = elem.getAttribute('data-id');
            
            if (!this.computerGameField.shoot(id)) {
                return;
            }
            
            this.session.emit('turn-'+this.player, id);
            this.isTurn = false;    
        }        
        
        /*
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
        */
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