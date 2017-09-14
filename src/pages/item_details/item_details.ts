import { Component, NgModule  } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, IonicPageModule } from 'ionic-angular';


@IonicPage()
@Component({
  	selector: 'page-item_details',
  	templateUrl: 'item_details.html',
})

export class ItemDetailsModal {
  	constructor(
  		public navCtrl: NavController, 
  		public navParams: NavParams,
  		public viewCtrl: ViewController,
  	){}

	ionViewDidLoad() {
    	console.log('ionViewDidLoad ItemDetailsPage');
  	}

	close_modal() {
		this.viewCtrl.dismiss();
  	}

}
