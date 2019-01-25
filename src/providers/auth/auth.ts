import { Injectable } from '@angular/core';

@Injectable()
export class AuthProvider {

  public nav: any;

  constructor() {
  }

  logout() {
    this.nav.setRoot('LoginPage');
  }

}