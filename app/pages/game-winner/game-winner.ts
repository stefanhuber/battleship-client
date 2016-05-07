import {Page, NavParams} from 'ionic-angular';


@Page({
    templateUrl: 'build/pages/game-winner/game-winner.html',
})
export class GameWinner {

    winner: string = '';

    constructor(private params: NavParams) {
        this.winner = params.get('winner');
    }


}
