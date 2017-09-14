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
  	

  details(record_id){
    let loading = this.loadingCtrl.create({content:'Loading Details...'})
    loading.present()
    this.http.get('https://catalog.tadl.org/main/details.json?id=' + record_id).map(res => res.json()).subscribe(data=>{
      loading.dismiss()
      if(data.id){
        let item_details_modal = this.modalCtrl.create(ItemDetailsModal, data);
        item_details_modal.present();
      }else{
      }
    });
  }

}
