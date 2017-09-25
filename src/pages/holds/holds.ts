import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Globals } from '../../app/globals';
import { User } from '../../app/user';
import { Item } from '../../app/item';

@IonicPage()
@Component({
    selector: 'page-holds',
    templateUrl: 'holds.html'
})
export class HoldsPage {

    confirmation: string = "0";

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public actionSheetCtrl: ActionSheetController,
        public user: User,
        public item: Item,
        public globals: Globals
    ) {
        this.user.load_holds();
    }

    cancelHold(holdId, holdTitle) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Cancel hold on ' + holdTitle,
            buttons: [
                {
                    text: 'Cancel Hold',
                    role: 'destructive',
                    handler: () => {
                        this.user.cancel_hold(holdId);
                    }
                }, {
                    text: 'Nevermind',
                    role: 'cancel',
                    handler: () => {
                    }
                }
            ]
        });
        actionSheet.present();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HoldsPage');
    }

}
