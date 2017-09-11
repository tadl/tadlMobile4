import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Globals } from '../../app/globals';
import {CheckoutsPage} from '../checkouts/checkouts'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  checkoutsPage = CheckoutsPage
  constructor(
  	public navCtrl: NavController,
  	public globals:Globals,
  ) {

  }
}
