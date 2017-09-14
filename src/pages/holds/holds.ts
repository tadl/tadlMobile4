import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/user'
import { Item } from '../../app/item'

/**
 * Generated class for the HoldsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-holds',
  templateUrl: 'holds.html',
})
export class HoldsPage {
    confirmation: string = "0"

  	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public user: User,
		public item: Item,
	) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HoldsPage');
    this.user.load_holds();
  }

}
