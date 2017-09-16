import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import { Http } from '@angular/http';
import { Item } from '../../app/item'
import 'rxjs/add/operator/map';


@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private http: Http,
        public item: Item,
        public loadingCtrl: LoadingController,
    ) {}

    advanced: boolean = this.navParams.get('advanced') || false
    query: string = this.navParams.get('query')
    results:Array<{any}> = []
    page: number = 0

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

}
