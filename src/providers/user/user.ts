import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { LocalStorageProvider } from '../local-storage/local-storage';

@Injectable()
export class UserProvider {

  usersCollection: AngularFirestoreCollection<any>;

  constructor(
    private afs: AngularFirestore,
    private localStorageService: LocalStorageProvider) {
  }

  getUser(uid) {
    this.usersCollection = this.afs.collection('users', ref => ref.where('uid', '==', uid));
    return this.usersCollection.snapshotChanges()
      .pipe(
        map(changes => {
          if (changes.length > 0) {
            const data = changes[0].payload.doc.data();
            data.id = changes[0].payload.doc.id;
            return { success: true, message: 'User found.', data: { id: changes[0].payload.doc.id, ...changes[0].payload.doc.data() } };
          }
          else {
            return { success: false, message: 'No user found.', data: null };
          }
          // return changes.map(a => {
          //   const data = a.payload.doc.data();
          //   data.id = a.payload.doc.id;
          //   return data;
          // })
        })
      );
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
