import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class LocalStorageProvider {

  constructor(private storage: Storage) {
  }

  setToken(data) {
    this.storage.set('wit-token', data);
  }

  getToken() {
    return this.storage.get('wit-token');
  }

  removeToken() {
    return this.storage.remove('wit-token');
  }

}
