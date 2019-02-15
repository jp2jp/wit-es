import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-evaluation',
  templateUrl: 'evaluation.html',
})
export class EvaluationPage {

  data: any;

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
    this.data = navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EvaluationPage');
    console.log(this.data);
  }

  complete() {
    const alert = this.alertCtrl.create({
      title: 'Confirm completion',
      message: 'Are you sure you want to complete this evaluation?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('Confirm clicked');
          }
        }
      ]
    });
    alert.present();
  }

  close() {
    this.viewCtrl.dismiss();
  }

}