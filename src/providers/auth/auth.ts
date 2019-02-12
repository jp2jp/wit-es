import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocalStorageProvider } from '../local-storage/local-storage';

@Injectable()
export class AuthProvider {

  public nav: any;

  constructor(
    private afAuth: AngularFireAuth,
    private localStorageService: LocalStorageProvider) {
  }

  login(user) {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  async logout() {
    await this.afAuth.auth.signOut();
    await this.localStorageService.removeToken();
    this.redirect();
  }

  redirect() {
    this.nav.setRoot('LoginPage');
  }

}