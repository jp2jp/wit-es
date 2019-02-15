import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
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
  teachers = [];
  isSearching: boolean = false;
  isLoading: boolean = true;
  isEmpty: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
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
          _.forEach(data, async element => {
            var teacher = this.teachers.find(e => e.teacherId == element.teacherId);
            if (teacher != null) {
              element.teacherData = teacher;
            }
            else {
              const user = await this.userService.getUser(element.teacherId)
                .subscribe(res => {
                  if (res.success) {
                    this.teachers.push(res.data);
                    element.teacherData = res.data;
                    user.unsubscribe();
                  }
                  else {
                    user.unsubscribe();
                  }
                })
            }
          })
          console.log(data);
          this.isLoading = false;
          if (data.length == 0) {
            this.isEmpty = true;
          }
        })
      }, error => {
        console.log(error);
        this.isLoading = false;
      })


    this.data = [
      {
        name: 'Arne Joy Perede',
        position: 'IT423A',
        department: 'Technical Writing',
        image: './assets/imgs/placeholders/1.png',
        date: '8min'
      },
      {
        name: 'Shaina Carbonilla',
        position: 'IT423B',
        department: 'Human Computer Interaction',
        image: './assets/imgs/placeholders/2.png',
        date: '8min'
      },
      {
        name: 'Timothy Labiao',
        position: 'IT423C',
        department: 'Management Information System',
        image: './assets/imgs/placeholders/4.png',
        date: '8min'
      },
      {
        name: 'Cherry Monocay',
        position: 'IT423D',
        department: 'Professional Ethics and Values Education',
        image: './assets/imgs/placeholders/3.png',
        date: '8min'
      },
      {
        name: 'Jimmy Magbanua',
        position: 'IT423E',
        department: 'Advanced Web Programming',
        image: './assets/imgs/placeholders/5.png',
        date: '8min'
      }
    ]
  }

  async appendData(data) {
    await this.teachers.push(data);
  }

  view(data) {
    // this.navCtrl.push('EvaluationPage', { data: data });
    this.modalCtrl.create('EvaluationPage', { data: data }).present();
  }

  getNumber() {
    return Math.floor(Math.random() * 6) + 1;
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