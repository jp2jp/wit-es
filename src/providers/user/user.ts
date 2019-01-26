import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class UserProvider {

  usersCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {
  }

  getUserData(uid) {
    this.usersCollection = this.afs.collection('users', ref => ref.where('uid', '==', uid));
    return this.usersCollection.snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          })
        })
      );
  }

}
