import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
        public user: User,
        public item: Item,
        public globals: Globals
    ) {
        this.user.load_holds();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HoldsPage');
    }

}
