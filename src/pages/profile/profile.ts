import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, FabContainer } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { DepartmentProvider } from '../../providers/department/department';
import { CameraProvider } from '../../providers/camera/camera';
import { LoaderProvider } from '../../providers/loader/loader';
import { ToastProvider } from '../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: any;
  department: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private loaderService: LoaderProvider,
    private toastService: ToastProvider,
    private cameraService: CameraProvider,
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
              this.getDepartment(response.data.departmentId);
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
                  .then(res => {
                    console.log(res);
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
                  .then(res => {
                    console.log(res);
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