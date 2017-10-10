import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Globals } from '../../app/globals';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
    selector: 'page-info',
    templateUrl: 'info.html'
})

export class InfoPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public nav: Nav,
        public loadingCtrl: LoadingController,
        public globals: Globals,
        private http: Http
    ) {
        this.get_info();
    }

    locations: Array<{any}> = [];
    url: string = this.globals.hoursURL;

    get_info() {
        let loading = this.loadingCtrl.create({content:'Loading...'});
        loading.present();
        this.http.get(this.url).finally(() => loading.dismiss()).map(res => res.json()).subscribe(
            data => {
                if (data.locations) {
                    this.locations = data.locations;
                }
            }, err => this.globals.error_handler(err)
        );
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InfoPage');
    }

}
