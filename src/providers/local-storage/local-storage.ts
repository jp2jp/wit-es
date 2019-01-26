import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class LocalStorageProvider {

  constructor(private storage: Storage) {
  }

  set(data) {
    this.storage.set('wit-user', data);
  }

  get() {
    return this.storage.get('wit-user');
  }

  remove() {
    return this.storage.remove('wit-user');
  }

}
