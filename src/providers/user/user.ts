import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class UserProvider {

  usersCollection: AngularFirestoreCollection<any>;
  userDocument: AngularFirestoreDocument<any>;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthProvider,
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
      if (token != null) {
        return this.getUser(token);
      }
      else {
        this.authService.logout();
      }
    }
    catch (error) {
      console.log(error);
      return error;
    }
  }

  updateUser(data, id) {
    const user = this.afs.collection('users').doc(id);
    return user.set(data, { merge: true });
  }

}
