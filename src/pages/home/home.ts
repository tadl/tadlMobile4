import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';
import { Globals } from '../../app/globals';
import {CheckoutsPage} from '../checkouts/checkouts'
import { SearchPage } from '../search/search'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
	searchPage = SearchPage
  checkoutsPage = CheckoutsPage

  query:string

  constructor(
  	public navCtrl: NavController,
  	public globals:Globals,
  	public nav: Nav,
  ) {

  }
}
