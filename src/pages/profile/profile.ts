import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { DepartmentProvider } from '../../providers/department/department';

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
    private departmentService: DepartmentProvider,
    private userService: UserProvider,
    private authService: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.getUserData();
  }

  logout() {
    this.authService.logout();
  }

  getUserData() {
    this.userService.getUserData()
      .then(result => {
        result.subscribe(response => {
          if (response.success) {
            this.user = response.data;
            console.log(this.user);
            this.getDepartment(response.data.departmentId);
          }
          else {
            console.log(response.message);
            this.logout();
          }
        })
      }, error => {
        console.log(error);
        this.logout();
      })
  }

  getDepartment(id) {
    this.departmentService.getDepartment(id)
      .subscribe(data => {
        this.department = data;
      })

  }

}