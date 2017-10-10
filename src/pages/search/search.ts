import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { IonicPage, NavController, NavParams, Nav, LoadingController, Events} from 'ionic-angular';
import { Globals } from '../../app/globals';
import { Http, URLSearchParams } from '@angular/http';
import { Item } from '../../app/item';
import { User } from '../../app/user';
import 'rxjs/Rx';

@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
})

export class SearchPage {
    url: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public item: Item,
        public nav: Nav,
        public globals: Globals,
        public loadingCtrl: LoadingController,
        public user: User,
        public events: Events,
        private http: Http,
        private inAppBrowser: InAppBrowser
    ) {
        if (this.navParams.get('query')) {
            this.get_results();
        }
    }

    advanced: boolean = this.navParams.get('advanced') || false;
    query: string = this.navParams.get('query');
    page: number = this.navParams.get('page') || 0;
    qtype: string = this.navParams.get('qtype') || 'keyword';
    format: string = this.navParams.get('format') || 'all';
    location: string = this.navParams.get('location') || '22'; /* FIXME can be a global config */
    available: boolean = this.navParams.get('available') || false;
    physical: boolean = this.navParams.get('physical') || false;
    current_params: string;
    last_page: number;
    more_results: boolean;

    results: Array<{any}> = [];

    get_results(){
        var loading = this.loadingCtrl.create({content:'Searching...'})

        /* Start ugly stuff we need to do to match current API */
        var available_on: string;
        if (this.available == true) {
            available_on = 'on';
        } else {
            available_on = 'off';
        }
        var physcial_on: string;
        if (this.physical == true) {
            physcial_on = 'on';
        } else {
            physcial_on = 'off';
        }
        /* End ugly stuff */

        let params = new URLSearchParams();
        params.append('query', this.query);
        params.append('qtype', this.qtype);
        params.append('fmt', this.format);
        params.append('loc', this.location);
        params.append('availability', available_on);
        params.append('physical', physcial_on);

        /* If user changes any parameter it is a new search that starts on page 0 */
        if(this.current_params != params.toString()){
            this.page = 0;
            loading.present();
        }

        /* If user clicks search again with no new parameters treat as brand new search  */
        if ((this.current_params == params.toString()) && (this.last_page == this.page)) {
            this.page = 0;
            loading.present();
            this.results = [];
        }

        this.current_params = params.toString();
        params.append('page', this.page.toString());
        this.http.get(this.globals.searchURL, {params})
            .finally(() => loading.dismiss())
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.items) {
                        this.more_results = data.more_results;
                        if (this.page == 0) {
                            this.results = data.items;
                            if (this.more_results == true) {
                               this.events.publish('new_search');
                            }
                        } else {
                            this.results.push.apply(this.results, data.items);
                            this.events.publish('infinite_done');
                        }
                        this.last_page = this.page;
                    } 
                },
                err => this.globals.error_handler(err)
            );
    }

    get_more_results(infiniteScroll){
        if (this.results.length > 1 && this.more_results == true) {
            this.page++;
            this.get_results();
        } else {
            infiniteScroll.complete();
            infiniteScroll.enable(false);
        }
        this.events.subscribe('infinite_done', () => {
            infiniteScroll.complete();
            console.log('triggered infinite_done event');
            if (this.more_results == false) {
                infiniteScroll.enable(false);
                this.events.subscribe('new_search', () => {
                    console.log('triggered new_search event');
                    if (this.more_results == true) {
                        infiniteScroll.enable(true);
                    }
                    this.events.unsubscribe('new_search');
                });
            }
            this.events.unsubscribe('infinite_done');
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchPage');
    }

    openWebpage(url: string) {
        const options: InAppBrowserOptions = {
            zoom: 'no'
        }
        const browser = this.inAppBrowser.create(url, '_self', options);
    }

}
