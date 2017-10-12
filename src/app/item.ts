import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController, Content, ModalController} from 'ionic-angular';
import { ItemDetailsModal } from '../pages/details/details';
import { Globals } from './globals';
import 'rxjs/add/operator/map';

@Component({
    providers: [Http]
})

export class Item {
    @ViewChild(Content) content: Content;

    constructor(
        private http: Http, 
        public globals: Globals,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController
    ) {
    }

    details(record_id) {
        let loading = this.loadingCtrl.create({content:'Loading Details...'});
        loading.present();
        this.http.get(this.globals.itemDetailsURL + '&id=' + record_id).map(res => res.json()).subscribe(data=>{
            loading.dismiss();
            if (data.id) {
                let details_modal = this.modalCtrl.create(ItemDetailsModal, data);
                details_modal.present();
            }
        });
    }

}
