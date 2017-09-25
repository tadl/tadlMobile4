import { NgModule, Component, ViewChild, Injectable, Input} from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, Content, ModalController} from 'ionic-angular';
import { ItemDetailsModal } from '../pages/details/details';
import { Globals } from './globals';
import 'rxjs/add/operator/map';

@Component({
    providers: [Http]
})

export class Item {
    @ViewChild(Content) content: Content;

    constructor(
        private alertCtrl: AlertController,
        private http: Http, 
        public globals: Globals,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController
    ) {
    }

    itemType = new Map<string, string>([
        ['text', 'book'],
        ['notated music', 'musical-notes'],
        ['cartographic', 'map'],
        ['moving image', 'film'],
        ['sound recording-nonmusical', 'disc'],
        ['sound recording-musical', 'disc'],
        ['still image', 'image'],
        ['software, multimedia', 'document'],
        ['kit', 'briefcase'],
        ['mixed-material', 'briefcase'],
        ['three dimensional object', 'archive']
    ]);

    details(record_id) {
        let loading = this.loadingCtrl.create({content:'Loading Details...'});
        loading.present();
        this.http.get(this.globals.itemDetailsURL + '?id=' + record_id).map(res => res.json()).subscribe(data=>{
            loading.dismiss();
            if (data.id) {
                let details_modal = this.modalCtrl.create(ItemDetailsModal, data);
                details_modal.present();
            } else {
            }
        });
    }

}
