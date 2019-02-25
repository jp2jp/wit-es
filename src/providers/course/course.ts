import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class CourseProvider {

  coursesCollection: AngularFirestoreCollection<any>;
  courseDocument: AngularFirestoreDocument<any>;

  constructor(private afs: AngularFirestore) {
  }

  getCourse(id) {
    this.courseDocument = this.afs.collection('courses').doc(id);
    return this.courseDocument.valueChanges();
  }

  getCourses() {
    this.coursesCollection = this.afs.collection('courses');
    return this.coursesCollection.snapshotChanges()
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
