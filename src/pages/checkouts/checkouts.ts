import { Component, Injectable, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
import { User } from '../../app/user'
import { Item } from '../../app/item'

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

@Injectable()
export class CheckoutsPage {
	@ViewChild(Content) content: Content;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public user: User,
    public item: Item,
  	public events: Events,) {
  		events.subscribe('renew',() =>{
  			this.content.scrollToTop();
		});
  	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutsPage');
    this.user.load_checkouts();
  }
}


