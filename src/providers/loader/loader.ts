import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoaderProvider {

  loader: any;

  constructor(private loadingCtrl: LoadingController) {
  }

  present(msg = null) {
    this.loader = this.loadingCtrl.create({
      content: msg,
      spinner: 'circles'
    })
    this.loader.present();
  }

  dismiss() {
    return this.loader.dismiss();
  }

}
