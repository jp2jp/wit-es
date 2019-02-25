import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, FabContainer } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { DepartmentProvider } from '../../providers/department/department';
import { CameraProvider } from '../../providers/camera/camera';
import { LoaderProvider } from '../../providers/loader/loader';
import { ToastProvider } from '../../providers/toast/toast';
import { CourseProvider } from '../../providers/course/course';
import { EvaluationProvider } from '../../providers/evaluation/evaluation';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: any;
  course: any;
  department: any;
  subjects: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private loaderService: LoaderProvider,
    private toastService: ToastProvider,
    private cameraService: CameraProvider,
    private courseService: CourseProvider,
    private evaluationService: EvaluationProvider,
    private departmentService: DepartmentProvider,
    private userService: UserProvider,
    private authService: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.getUserData();
  }

  logout(fab: FabContainer) {
    if (fab) fab.close();
    this.authService.logout();
  }

  getUserData() {
    this.userService.getUserData()
      .then(result => {
        if (result) {
          result.subscribe(response => {
            if (response.success) {
              this.user = response.data;
              console.log(this.user);
              this.getCourse(this.user.courseId);
              this.getDepartment(this.user.departmentId);
              this.getSubjects();
            }
            else {
              console.log(response.message);
              this.authService.logout();
            }
          })
        }
      }, error => {
        console.log(error);
        this.authService.logout();
      })
  }

  getDepartment(id) {
    if (!id) return;
    this.departmentService.getDepartment(id)
      .subscribe(data => {
        this.department = data;
      })
  }

  getCourse(id) {
    if (!id) return;
    this.courseService.getCourse(id)
      .subscribe(data => {
        this.course = data;
      })
  }

  getSubjects() {
    this.evaluationService.getClassListData()
      .then(res => {
        if (res) {
          res.subscribe(data => {
            this.subjects = data;
            console.log(this.subjects)
          })
        }
      })
  }

  settings(fab: FabContainer) {
    if (fab) fab.close();
  }

  changeImage(fab: FabContainer) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose option',
      buttons: [
        {
          text: 'Gallery',
          icon: 'ios-images-outline',
          handler: () => {
            if (fab) fab.close();
            this.loaderService.present();
            this.cameraService.getPicture(0)
              .then(imageData => {
                var base64Img: string = 'data:image/jpeg;base64,' + imageData;
                this.userService.updateUser({ profileImage: base64Img }, this.user.uid)
                  .then(() => {
                    this.loaderService.dismiss();
                    this.toastService.presentToast('Profile picture updated.');
                  }, error => {
                    console.log(error);
                    this.loaderService.dismiss();
                    this.toastService.presentToast('Uploading image failed.');
                  })
              }, error => {
                console.log(error);
                this.loaderService.dismiss();
              })
          }
        },
        {
          text: 'Camera',
          icon: 'ios-camera-outline',
          handler: () => {
            if (fab) fab.close();
            this.loaderService.present();
            this.cameraService.getPicture(1)
              .then(imageData => {
                var base64Img: string = 'data:image/jpeg;base64,' + imageData;
                this.userService.updateUser({ profileImage: base64Img }, this.user.uid)
                  .then(() => {
                    this.loaderService.dismiss();
                    this.toastService.presentToast('Profile picture updated.');
                  }, error => {
                    console.log(error);
                    this.loaderService.dismiss();
                    this.toastService.presentToast('Uploading image failed.');
                  })
              }, error => {
                this.loaderService.dismiss();
                console.log(error)
              })
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}