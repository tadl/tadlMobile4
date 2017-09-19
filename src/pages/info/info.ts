import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
    selector: 'page-info',
    templateUrl: 'info.html',
})

export class InfoPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public nav: Nav,
        public loadingCtrl: LoadingController,
        private http: Http,
    ) {
        this.get_info();
    }

    locations: Array<{any}> = [];
    url: string = "https://www.tadl.org/wp-content/uploads/json/parsed-hours.json";

    get_info() {
        let loading = this.loadingCtrl.create({content:'Loading...'});
        loading.present();
        this.http.get(this.url).map(res => res.json()).subscribe(data=>{
            loading.dismiss();
            if (data.locations) {
                this.locations = data.locations;
            }
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InfoPage');
    }

}
