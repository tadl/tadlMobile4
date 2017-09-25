import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Globals } from '../../app/globals';


@IonicPage()
@Component({
    selector: 'page-debug',
    templateUrl: 'debug.html'
})
export class DebugPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public globals: Globals
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DebugPage');
    }

}
