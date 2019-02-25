import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoaderProvider } from '../../providers/loader/loader';
import { UserProvider } from '../../providers/user/user';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { ToastProvider } from '../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: any = {};
  userSubscribe: any;
  displayLogin: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastService: ToastProvider,
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
          this.navCtrl.setRoot('TabsPage');
        }
        else {
          this.displayLogin = true;
        }
      }, error => {
        console.log(error);
        this.displayLogin = true;
      })
  }

  login(user) {
    this.loaderService.present();
    this.authService.login(user)
      .then(result => {
        this.userSubscribe = this.userService.getUser(result.user.uid)
          .subscribe(response => {
            console.log(response)
            if (response.success && response.data.role == 'student') {
              this.localStorageService.setToken(result.user.uid);
              this.loaderService.dismiss();
              this.navCtrl.setRoot('TabsPage');
            }
            else {
              this.loaderService.dismiss();
              this.toastService.presentToast('Invalid Login');
              this.authService.logout();
            }
          }, error => {
            console.log(error);
            this.loaderService.dismiss();
            this.toastService.presentToast('Invalid Login');
          })
      }, error => {
        console.log(error);
        this.loaderService.dismiss();
        if (error.code == 'auth/wrong-password') {
          this.toastService.presentToast('Invalid password.');
        }
        else if ('auth/user-not-found') {
          this.toastService.presentToast('User not found.');
        }
        else {
          this.toastService.presentToast('Invalid Login');
        }
      })
  }

  ionViewDidLeave() {
    if (this.userSubscribe != null) {
      this.userSubscribe.unsubscribe();
    }
  }

}