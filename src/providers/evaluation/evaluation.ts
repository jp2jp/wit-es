import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class EvaluationProvider {

  constructor(
    private afs: AngularFirestore,
    private authService: AuthProvider,
    private localStorageService: LocalStorageProvider) {
  }

  getClassList(id) {
    const classListCollection: AngularFirestoreCollection<any> = this.afs.collection('class-lists', ref => ref.where(`students.${id}`, '==', true));
    return classListCollection.snapshotChanges()
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

  async getClassListData() {
    try {
      const token = await this.localStorageService.getToken();
      if (token != null) {
        return this.getClassList(token);
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

  getEvaluations(id) {
    const evaluationsCollection: AngularFirestoreCollection<any> = this.afs.collection('evaluations', ref => ref.where('studentId', '==', id));
    return evaluationsCollection.snapshotChanges()
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

  async getEvaluationsData() {
    try {
      const token = await this.localStorageService.getToken();
      if (token != null) {
        return this.getEvaluations(token);
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

  addEvaluation(data) {
    const evaluationsCollection: AngularFirestoreCollection<any> = this.afs.collection('evaluations');
    return evaluationsCollection.add(data);
  }

}