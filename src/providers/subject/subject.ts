import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class SubjectProvider {

  subjectDocument: AngularFirestoreDocument<any>;

  constructor(private afs: AngularFirestore) {
  }

  getSubject(id) {
    this.subjectDocument = this.afs.collection('subjects').doc(id);
    return this.subjectDocument.snapshotChanges()
      .pipe(
        map(changes => {
          if (changes.payload.data()) {
            const data = changes.payload.data();
            data.id = changes.payload.id;
            return { success: true, message: 'Subject found.', data: { id: changes.payload.id, ...changes.payload.data() } };
          }
          else {
            return { success: false, message: 'No subject found.', data: null };
          }
        })
      )
  }

}