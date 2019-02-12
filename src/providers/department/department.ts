import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class DepartmentProvider {

  departmentsCollection: AngularFirestoreCollection<any>;
  deparmentDocument: AngularFirestoreDocument<any>;

  constructor(private afs: AngularFirestore) {
  }

  getDepartment(id) {
    this.deparmentDocument = this.afs.collection('departments').doc(id);
    return this.deparmentDocument.valueChanges();
  }

}