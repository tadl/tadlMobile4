import { Component, NgModule  } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, IonicPageModule } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { Globals } from '../../app/globals'
import { User } from '../../app/user'

@IonicPage()
@Component({
  	selector: 'page-details',
  	templateUrl: 'details.html',
})

export class ItemDetailsModal {
    url: string;

  	constructor(
  		public navCtrl: NavController, 
  		public navParams: NavParams,
  		public viewCtrl: ViewController,
      public globals: Globals,
  		public user: User,
      private inAppBrowser: InAppBrowser
  	){}

  	title: string = this.navParams.get('title')
  	author: string = this.navParams.get('author')
  	abstract: string = this.navParams.get('abstract')
  	contents: string = this.navParams.get('contents')
  	id: number = this.navParams.get('id')
  	electronic: boolean = this.navParams.get('electronic')
  	eresource: string = this.navParams.get('eresource')
  	call_number: string = this.navParams.get('call_number')
  	format_type: string = this.navParams.get('format_type')
  	record_year: string = this.navParams.get('record_year')
  	publisher: string = this.navParams.get('publisher')
  	publication_place: string = this.navParams.get('publication_place')
  	physical_description: string = this.navParams.get('physical_description')
  	holds: number = this.navParams.get('holds')
  	holdings: Array<{any}> = this.navParams.get('holdings')
  	availability: Array<{any}> = this.navParams.get('availability')
    loc_copies_available: number = this.navParams.get('loc_copies_available')
    loc_copies_total: number = this.navParams.get('loc_copies_total')

    items: string = this.loc_copies_available >= 1 ? 'Available' : 'All Copies'

	ionViewDidLoad() {
    	console.log('ionViewDidLoad ItemDetailsPage');
  	}

	close_modal() {
		this.viewCtrl.dismiss();
  	}

    openWebpage(url: string) {
        const options: InAppBrowserOptions = {
            zoom: 'no',
        }
        const browser = this.inAppBrowser.create(url, '_self', options);
    }

}
