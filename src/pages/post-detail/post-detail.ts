import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Globals } from '../../app/globals';

@IonicPage()
@Component({
    selector: 'page-post-detail',
    templateUrl: 'post-detail.html'
})
export class PostDetailPage {

    selectedItem: any;

    constructor(
        private navParams: NavParams,
        private nav: NavController,
        public globals: Globals
    ) {
        this.selectedItem = navParams.get('item');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PostDetailPage');
    }

}
