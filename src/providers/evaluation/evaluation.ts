import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class EvaluationProvider {

  evaluationsCollection: AngularFirestoreCollection<any>;
  evaluationDocument: AngularFirestoreDocument<any>;

  constructor(private afs: AngularFirestore) {
  }

}