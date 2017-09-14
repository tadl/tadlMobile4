import { NgModule, Component, Injectable, Input} from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Component({
    providers: [Http],
})

export class User {
	constructor(
		private http: Http, 
		private storage: Storage,){ }
  	
  	username: string
  	password: string
  	logged_in : boolean
  	full_name: string
  	checkout_count: string
  	holds: string
  	holds_ready:string
  	fines:string
  	card:string
  	token:string
  	login_error:string
  	checkouts:Array<{any}>
  	
  	/** Auto Log User in if username and password in local storage */
  	auto_login(){
  	  	this.storage.get('username').then(data => {if(data){
  			this.storage.get('username').then((val) => {
  				this.username = val
  			})
  		}})
  		this.storage.get('password').then(data => {if(data){
  			this.storage.get('password').then((val) => {
  				this.password = val
  				this.login()
  			}) 
  		}})
  	}
  	
  	/** Login User */
  	login(){
  		this.login_error = ''
    	this.http.get('https://catalog.tadl.org/login.json?username=' + this.username + '&password=' + this.password).map(res => res.json()).subscribe(data=>{
			if(data.token){
				this.logged_in = true
				this.full_name = data.full_name
				this.checkout_count = data.checkouts
				this.holds = data.holds
				this.fines = data.fine
				this.holds_ready = data.holds_ready
				this.card = data.card
				this.token = data.token
				this.storage.set('username', this.username)
				this.storage.set('password', this.password)
			}else{
				this.login_error = "Unable to login with this username and password. Please try again or request a password reset."
			}
		});
  	}
  	
  	/** Logout User */
  	logout(){
  		this.logged_in = false
  		this.username = ''
  		this.password = ''
  		this.storage.clear()
  	}

  	/** Get Checkouts */
  	load_checkouts(){
  		this.http.get('https://catalog.tadl.org/checkouts.json?token=' + this.token).map(res => res.json()).subscribe(data=>{
			if(data.checkouts){
				this.checkouts = data.checkouts
			}else{
			}
  		});
  	}

    /* get holds */
  	load_holds(){
  		this.http.get('https://catalog.tadl.org/holds.json?token=' + this.token).map(res => res.json()).subscribe(data=>{
			if(data.holds){
				this.holds = data.holds
			}else{
			}
  		});
  	}
}
