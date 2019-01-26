import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1: any;
  tab2: any;
  badgeValue: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthProvider) {
    this.tab1 = 'HomePage';
    this.tab2 = 'ProfilePage';
    this.authService.nav = navCtrl;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  tabChange(data) {
    if (data == 'HomePage') {
      this.badgeValue = 0;
    }
    else {
      this.badgeValue = 4;
    }
  }

}