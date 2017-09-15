import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  advanced: boolean = this.navParams.get('advanced') || false
  query: string = this.navParams.get('query')

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

}
