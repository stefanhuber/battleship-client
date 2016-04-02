import {Page, NavParams} from 'ionic-angular';


@Page({
    templateUrl: 'build/pages/game-play/game-play.html',
})
export class GamePlay {

    constructor(private params: NavParams) {
        console.log(params);
    }
}