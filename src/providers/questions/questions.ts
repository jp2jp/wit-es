import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class QuestionsProvider {

  questionsCollection: AngularFirestoreCollection<any>;
  public questions: any;

  constructor(private afs: AngularFirestore) {
  }

  getQuestions() {
    this.questionsCollection = this.afs.collection('questions');
    return this.questionsCollection.snapshotChanges()
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