import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoaderProvider } from '../../providers/loader/loader';
import { UserProvider } from '../../providers/user/user';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: any = {};
  userSubscribe: any;
  isLoggedIn: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorageService: LocalStorageProvider,
    private loaderService: LoaderProvider,
    private userService: UserProvider,
    private authService: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.localStorageService.getToken()
      .then(result => {
        if (result) {
          this.isLoggedIn = true;
          this.navCtrl.setRoot('TabsPage');
        }
      }, error => {
        console.log(error);
      })
  }

  login(user) {
    this.loaderService.present();
    this.authService.login(user)
      .then(result => {
        this.userSubscribe = this.userService.getUser(result.user.uid)
          .subscribe(response => {
            if (response.success) {
              this.localStorageService.setToken(result.user.uid);
              this.loaderService.dismiss();
              this.navCtrl.setRoot('TabsPage');
            }
            else {
              this.loaderService.dismiss();
            }
          }, error => {
            console.log(error);
            this.loaderService.dismiss();
          })
      }, error => {
        console.log(error);
        this.loaderService.dismiss();
      })
  }

  ionViewDidLeave() {
    if (this.userSubscribe != null) {
      this.userSubscribe.unsubscribe();
    }
  }

}