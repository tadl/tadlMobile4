import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Globals } from '../../app/globals';
import JsBarcode from 'jsbarcode';

@IonicPage()
@Component({
    selector: 'page-barcode',
    templateUrl: 'barcode.html'
})
export class BarcodePage {

    @ViewChild('barcode') barcode: ElementRef;
    cardnumber: string = this.navParams.get('cardnumber') || '0';

    constructor(
        private nav: NavController,
        public navParams: NavParams,
        public globals: Globals
    ) {
    }

    ionViewDidLoad() {
        JsBarcode(this.barcode.nativeElement, this.cardnumber, { fontSize: 16, textMargin: 0});
    }

}
