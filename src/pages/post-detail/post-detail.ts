import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-post-detail',
    templateUrl: 'post-detail.html',
})
export class PostDetailPage {

    selectedItem: any;

    constructor(private nav: NavController, navParams: NavParams) {
        this.selectedItem = navParams.get('item');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PostDetailPage');
    }

}
