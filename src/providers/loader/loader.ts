import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoaderProvider {

  loader: any;

  constructor(private loadingCtrl: LoadingController) {
  }

  present(msg = '') {
    this.loader = this.loadingCtrl.create({
      content: msg,
      spinner: 'crescent'
    })
    this.loader.present();
  }

  dismiss() {
    this.loader.dismiss();
  }

}
