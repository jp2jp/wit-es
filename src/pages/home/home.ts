import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { EvaluationProvider } from '../../providers/evaluation/evaluation';
import * as _ from 'lodash';
import { UserProvider } from '../../providers/user/user';
import { SubjectProvider } from '../../providers/subject/subject';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  data: any;
  backupData: any;
  teachers = [];
  isSearching: boolean = false;
  isLoading: boolean = true;
  isEmpty: boolean = false;
  calendar = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: 'ddd ha',
    sameElse: 'MMM d'
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private userService: UserProvider,
    private subjectService: SubjectProvider,
    private evaluationService: EvaluationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.getData();
  }

  getData() {
    this.evaluationService.getEvaluationData()
      .then(result => {
        if (result) {
          result.subscribe(data => {
            _.forEach(data, async element => {
              element.image = this.getRandomImage();
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
              const subject = await this.subjectService.getSubject(element.subjectId)
                .subscribe(res => {
                  if (res.success) {
                    element.subjectData = res.data;
                    subject.unsubscribe();
                  }
                  else {
                    subject.unsubscribe();
                  }
                })
            })
            this.data = data;
            this.backupData = data;
            console.log(this.data);
            this.isLoading = false;
            if (data.length == 0) {
              this.isEmpty = true;
            }
          })
        }
      }, error => {
        console.log(error);
        this.isLoading = false;
      })

    // this.data = [
    //   {
    //     name: 'Arne Joy Perede',
    //     position: 'IT423A',
    //     department: 'Technical Writing',
    //     image: './assets/imgs/placeholders/1.png',
    //     date: '8min'
    //   },
    //   {
    //     name: 'Shaina Carbonilla',
    //     position: 'IT423B',
    //     department: 'Human Computer Interaction',
    //     image: './assets/imgs/placeholders/2.png',
    //     date: '8min'
    //   },
    //   {
    //     name: 'Timothy Labiao',
    //     position: 'IT423C',
    //     department: 'Management Information System',
    //     image: './assets/imgs/placeholders/4.png',
    //     date: '8min'
    //   },
    //   {
    //     name: 'Cherry Monocay',
    //     position: 'IT423D',
    //     department: 'Professional Ethics and Values Education',
    //     image: './assets/imgs/placeholders/3.png',
    //     date: '8min'
    //   },
    //   {
    //     name: 'Jimmy Magbanua',
    //     position: 'IT423E',
    //     department: 'Advanced Web Programming',
    //     image: './assets/imgs/placeholders/5.png',
    //     date: '8min'
    //   }
    // ]
  }

  async appendData(data) {
    await this.teachers.push(data);
  }

  view(data) {
    // this.navCtrl.push('EvaluationPage', { data: data });
    this.modalCtrl.create('EvaluationPage', { data: data }).present();
  }

  getRandomImage() {
    var num = Math.floor(Math.random() * 6) + 1
    return './assets/imgs/placeholders/' + num + '.png';
  }

  onSearch(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.isSearching = true;
      this.data = this.data.filter(element => element.teacherData.firstName.replace(/\s/g, '').toLowerCase().indexOf(val.replace(/\s/g, '').toLowerCase()) + 1
        || element.teacherData.lastName.replace(/\s/g, '').toLowerCase().indexOf(val.replace(/\s/g, '').toLowerCase()) + 1
        || element.subjectData.subjectName.replace(/\s/g, '').toLowerCase().indexOf(val.replace(/\s/g, '').toLowerCase()) + 1
        || element.subjectData.subjectDesc.replace(/\s/g, '').toLowerCase().indexOf(val.replace(/\s/g, '').toLowerCase()) + 1);
    }
    else {
      this.isSearching = false;
      this.data = this.backupData;
    }
  }

}