import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FirebaseConfig } from './firebase.config';
import { LoaderProvider } from '../providers/loader/loader';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { UserProvider } from '../providers/user/user';
import { EvaluationProvider } from '../providers/evaluation/evaluation';
import { DepartmentProvider } from '../providers/department/department';
export const firebaseConfig = FirebaseConfig.firebaseConfig;

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md'
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    LoaderProvider,
    LocalStorageProvider,
    UserProvider,
    EvaluationProvider,
    DepartmentProvider
  ]
})
export class AppModule {
}
