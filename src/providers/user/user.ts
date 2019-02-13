import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { LocalStorageProvider } from '../local-storage/local-storage';

@Injectable()
export class UserProvider {

  usersCollection: AngularFirestoreCollection<any>;
  userDocument: AngularFirestoreDocument<any>;

  constructor(
    private afs: AngularFirestore,
    private localStorageService: LocalStorageProvider) {
  }

  getUser(id) {
    this.userDocument = this.afs.collection('users').doc(id);
    return this.userDocument.snapshotChanges()
      .pipe(
        map(changes => {
          if (changes.payload.data()) {
            const data = changes.payload.data();
            data.id = changes.payload.id;
            return { success: true, message: 'User found.', data: { id: changes.payload.id, ...changes.payload.data() } };
          }
          else {
            return { success: false, message: 'No user found.', data: null };
          }
        })
      )
  }

  async getUserData() {
    try {
      const token = await this.localStorageService.getToken();
      return this.getUser(token);
    }
    catch (error) {
      console.log(error);
      return error;
    }
  }

}
