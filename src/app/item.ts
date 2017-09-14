import { NgModule, Component, ViewChild, Injectable, Input} from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, Content, Events, ModalController} from 'ionic-angular';
import { ItemDetailsModal } from '../pages/item_details/item_details'
import 'rxjs/add/operator/map';

@Component({
    providers: [Http],
})

export class Item {
	@ViewChild(Content) content: Content;
	constructor(
		private alertCtrl: AlertController,
		private http: Http, 
		public loadingCtrl: LoadingController,
		public events: Events,
    public modalCtrl: ModalController,
	){}
  	

  username: string
  password: string
  logged_in : boolean
  full_name: string
  checkout_count: string
  holds: string
  holds_ready:string
  fines:string
  card:string
  token:string
  login_error:string
  checkouts:Array<{any}> = []
  checkout_mesages:string
  checkout_errors:Array<{any}> = []

  details(){
    let item_details_modal = this.modalCtrl.create(ItemDetailsModal);
    item_details_modal.present();
  }

}