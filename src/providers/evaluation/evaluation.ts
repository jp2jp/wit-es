import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { LocalStorageProvider } from '../local-storage/local-storage';

@Injectable()
export class EvaluationProvider {

  evaluationsCollection: AngularFirestoreCollection<any>;
  teacherDocument: AngularFirestoreDocument<any>;

  constructor(
    private afs: AngularFirestore,
    private localStorageService: LocalStorageProvider) {
  }

  getEvaluations(id) {
    this.evaluationsCollection = this.afs.collection('class-lists', ref => ref.where(`students.${id}`, '==', true));
    return this.evaluationsCollection.snapshotChanges()
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

  async getEvaluationData() {
    try {
      const token = await this.localStorageService.getToken();
      return this.getEvaluations(token);
    }
    catch (error) {
      console.log(error);
      return error;
    }
  }

}