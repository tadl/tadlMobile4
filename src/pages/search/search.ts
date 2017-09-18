import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { IonicPage, NavController, NavParams, Nav, LoadingController } from 'ionic-angular';
import { Globals } from '../../app/globals';
import { Http } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Item } from '../../app/item';
import { User } from '../../app/user';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})

export class SearchPage {
    url: string;

    constructor(
        /* we should use formbuilder for this https://ionicframework.com/docs/developer-resources/forms/ */
        public navCtrl: NavController,
        public navParams: NavParams,
        public item: Item,
        public nav: Nav,
        public globals: Globals,
        public loadingCtrl: LoadingController,
        public user: User,
        private http: Http,
        private inAppBrowser: InAppBrowser,
    ) {}

    advanced: boolean = this.navParams.get('advanced') || false
    query: string = this.navParams.get('query')
    page: number = this.navParams.get('page') || 0
    qtype: string = this.navParams.get('qtype') || 'keyword'
    format: string = this.navParams.get('format') || 'all'
    location: string = this.navParams.get('location') || '22' /* FIXME can be a global config */
    available: boolean = this.navParams.get('available') || false
    physical: boolean = this.navParams.get('physical') || false

    results: Array<{any}> = []

    get_results(){
        let loading = this.loadingCtrl.create({content:'Searching...'})
        loading.present()
        this.http.get('https://catalog.tadl.org/search.json?query=' + this.query).map(res => res.json()).subscribe(data=>{
            loading.dismiss()
            if(data.items){
                this.results = data.items
            }else{
            }
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchPage');
        if(this.navParams.get('query')){
            this.get_results()
        }
    }

    openWebpage(url: string) {
        const options: InAppBrowserOptions = {
            zoom: 'no',
        }
        const browser = this.inAppBrowser.create(url, '_self', options);
    }

}
