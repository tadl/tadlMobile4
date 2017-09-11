import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/user'

/**
 * Generated class for the CheckoutsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkouts',
  templateUrl: 'checkouts.html',
})
export class CheckoutsPage {

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public user: User) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutsPage');
    this.user.load_checkouts()
  }

}
