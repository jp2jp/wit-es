import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EvaluationProvider } from '../../providers/evaluation/evaluation';
import * as _ from 'lodash';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  data: any;
  isSearching: boolean = false;
  teachers = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserProvider,
    private evaluationService: EvaluationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.getData();
  }

  getData() {
    this.evaluationService.getEvaluationData()
      .then(result => {
        result.subscribe(data => {
          _.forEach(data, element => {
            var teacher = this.teachers.find(e => e.teacherId == element.teacherId);
            if (teacher != null) {
              element.teacherData = teacher;
            }
            else {
              this.userService.getUser(element.teacherId)
                .subscribe(res => {
                  if (res.success) {
                    this.teachers.push(res.data);
                    element.teacherData = res.data;
                  }
                })
            }
          })
          console.log(data)
        })
      })


    this.data = [
      {
        name: 'Arne Joy Perede',
        position: 'Faculty',
        department: 'IT Department',
        image: './assets/imgs/miss1.png'
      },
      {
        name: 'Shaina Carbonilla',
        position: 'Faculty',
        department: 'Engineering Department',
        image: './assets/imgs/miss2.png'
      },
      {
        name: 'Timothy Labiao',
        position: 'Faculty',
        department: 'Arts Department',
        image: './assets/imgs/sir1.png'
      },
      {
        name: 'Cherry Monocay',
        position: 'Faculty',
        department: 'Education Department',
        image: './assets/imgs/miss1.png'
      },
      {
        name: 'Jimmy Magbanua',
        position: 'Faculty',
        department: 'CBA Department',
        image: './assets/imgs/sir2.png'
      }
    ]
  }

  view(data) {
    this.navCtrl.push('EvaluationPage', { data: data });
  }

  onSearch(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.isSearching = true;
      this.data = this.data.filter(element => element.name.replace(/\s/g, '').toLowerCase().indexOf(val.replace(/\s/g, '').toLowerCase()) + 1);
    }
    else {
      this.isSearching = false;
      this.getData();
    }
  }

}