import {Page} from 'ionic-angular';


@Page({
    templateUrl: 'build/pages/game-setup/game-setup.html',
})
export class GameSetup {

    cells: Array<number> = [];

    constructor() {
        for ( let i = 0; i < 100; i++ ) {
            this.cells.push(i);
        }
    }
}
