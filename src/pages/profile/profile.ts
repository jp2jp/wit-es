import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserProvider,
    private authService: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.getUserData();
  }

  logout() {
    this.authService.logout();
  }

  getUserData() {
    this.userService.getUserData()
    .then( result => {
      result.subscribe( response => {
        if (response.success) {
          this.user = response.data;
          console.log(this.user);
        }
        else {
          console.log(response.message);
          this.logout();
        }
      })
    }, error => {
      console.log(error);
      this.logout();
    })
  }

}