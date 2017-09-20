import { NgModule, Component, ViewChild, Injectable, Input} from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, Content, Events, ModalController} from 'ionic-angular';
import { Globals } from './globals'
import 'rxjs/add/operator/map';

@Component({
    providers: [Http],
})

export class User {
	@ViewChild(Content) content: Content;
	constructor(
		private alertCtrl: AlertController,
		private http: Http, 
		public loadingCtrl: LoadingController,
		private storage: Storage,
		public events: Events,
    public globals: Globals,
    public modalCtrl: ModalController,
	){}
  	

  	username: string
  	password: string
  	logged_in : boolean
  	full_name: string
  	checkout_count: string
  	holds_count: string
  	holds_ready:string
  	fines:string
  	card:string
  	token:string
    default_pickup:string
  	login_error:string
  	holds:Array<{any}> = []
  	checkouts:Array<{any}> = []
  	checkout_mesages:string
  	checkout_errors:Array<{any}> = []
  	
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
				this.holds_count = data.holds
				this.fines = data.fine
				this.holds_ready = data.holds_ready
				this.card = data.card
				this.token = data.token
        this.default_pickup = this.pickup_code_to_name(data.pickup_library)
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
  		let loading = this.loadingCtrl.create({content:'Loading Checkouts...'})
  		loading.present()
  		this.checkout_errors.length = 0
  		this.http.get('https://catalog.tadl.org/checkouts.json?token=' + this.token).map(res => res.json()).subscribe(data=>{
			loading.dismiss()
			if(data.checkouts){
				this.checkouts = data.checkouts
			}else{
			}
  		});
  	}


  	/** Renew Items */
  	renew(checkout_ids:string, record_ids:string){
  		let loading = this.loadingCtrl.create({content:'Attempting renewal...'})
  		loading.present()
  		this.checkout_errors.length = 0
  		this.http.get('https://catalog.tadl.org/main/renew_checkouts.json?token=' + this.token + '&checkout_ids=' + checkout_ids + '&record_ids=' + record_ids).map(res => res.json()).subscribe(data=>{
				if(data.checkouts){
					loading.dismiss()
					if(data.errors.length > 0 && !data.message.startsWith("Failed") ){
						var message:string = data.message + ' ' + 'One or more items failed to renew.'
					}else{
						var message:string = data.message
					}
					let alert = this.alertCtrl.create({
						title: message,
						buttons: [{
							text: 'Ok',
							handler: ()=>{
								this.checkouts = data.checkouts
								this.checkout_errors = data.errors
								this.events.publish('renew')
							},
						}]
					});
					alert.present();
				}
      });
    }

   /* get holds */

  	load_holds(){
  		let loading = this.loadingCtrl.create({content:'Loading Holds...'})
  		loading.present()
  		this.http.get('https://catalog.tadl.org/holds.json?token=' + this.token).map(res => res.json()).subscribe(data=>{
			loading.dismiss()
			if(data.holds){
				this.holds = data.holds
			}else{
			}
  		});
  	}

    /** Place Hold */

    place_hold(record_id){
      let loading = this.loadingCtrl.create({content:'Placing Hold...'})
      loading.present()
      this.http.get('https://catalog.tadl.org/place_hold.json?token=' + this.token + '&record_id=' + record_id).map(res => res.json()).subscribe(data=>{
        loading.dismiss()
        if(data.hold_confirmation){
          this.holds_count = data.user.holds
          let alert = this.alertCtrl.create({
            title: data.hold_confirmation[0].message,
            subTitle: 'Pickup location: ' + this.default_pickup,
            buttons: [{
              text: 'Ok',
              handler: ()=>{
                return
              },
            }]
          });
          alert.present();
        }else{
        }
      });
    }

    /** Cancel Hold */

    cancel_hold(hold_id){
      let loading = this.loadingCtrl.create({content:'Canceling Hold...'})
      loading.present()
      this.http.get('https://catalog.tadl.org/main/manage_hold.json?token=' + this.token + '&hold_id=' + hold_id + '&task=cancel').map(res => res.json()).subscribe(data=>{
         loading.dismiss()
        if(data.target_holds){
          this.holds = data.holds
          this.holds_count = data.user.holds
          this.holds_ready = data.user.holds_ready
        }else{
        }
      });
    }

    /** Suspend Hold */
    suspend_hold(hold_id){
      let loading = this.loadingCtrl.create({content:'Suspending Hold...'})
      loading.present()
      this.http.get('https://catalog.tadl.org/main/manage_hold.json?token=' + this.token + '&hold_id=' + hold_id + '&task=suspend').map(res => res.json()).subscribe(data=>{
         loading.dismiss()
        if(data.target_holds){
          this.holds = data.holds
        }else{
        }
      });
    }

    /** Activate Hold */
    activate_hold(hold_id){
      let loading = this.loadingCtrl.create({content:'Activating Hold...'})
      loading.present()
      this.http.get('https://catalog.tadl.org/main/manage_hold.json?token=' + this.token + '&hold_id=' + hold_id + '&task=activate').map(res => res.json()).subscribe(data=>{
         loading.dismiss()
        if(data.target_holds){
          this.holds = data.holds
        }else{
        }
      });
    }

    /** Change Hold Pickup Loaction */
    change_hold_pickup(hold_id, event){
      let loading = this.loadingCtrl.create({content:'Changing Pickup Location...'})
      loading.present()
      let params = new URLSearchParams()
      params.append('token', this.token)
      params.append('hold_id', hold_id)
      params.append('new_pickup', event)
      params.append('hold_state', 'f')
      this.http.get('https://catalog.tadl.org/main/update_hold_pickup.json', {params} ).map(res => res.json()).subscribe(data=>{
        loading.dismiss()
        if(data.message){
          let alert = this.alertCtrl.create({
            title: 'Pickup location succesfully changed to ' + data.message.pickup_location,
            buttons: [{
              text: 'Ok',
              handler: ()=>{
                this.load_holds()
              },
            }]
          });
          alert.present();
        }
      });
    }

  	/** Renew all items */
  	renew_all(){
  		var record_ids:string = ''
  		var checkout_ids: string = ''
  		for(let checkout of this.checkouts){
  			record_ids = record_ids + checkout['record_id'] + ','
  			checkout_ids = checkout_ids + checkout['checkout_id'] + ','
  		};
  		this.renew(checkout_ids, record_ids)
  	}

  	/** Remove all checkout error messages */
  	clear_checkout_errors(){
  		this.checkout_errors.length = 0
  	}

    /** Get 'pretty' string for user's default pickup location */

    pickup_code_to_name(location_code){
      var location = this.pickup_code_search(location_code, this.globals.pickup_locations)
      return location.name
    }

    pickup_code_search(nameKey, myArray){
      for (var i=0; i < myArray.length; i++) {
        if (myArray[i].code === nameKey) {
            return myArray[i];
        }
      }
    }
}
