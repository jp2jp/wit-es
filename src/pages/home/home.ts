import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { EvaluationProvider } from '../../providers/evaluation/evaluation';
import * as _ from 'lodash';
import { UserProvider } from '../../providers/user/user';
import { SubjectProvider } from '../../providers/subject/subject';
import { ToastProvider } from '../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  data: any;
  evaluations: any;
  backupData: any;
  teachers = [];
  isSearching: boolean = false;
  isLoading: boolean = true;
  isEmpty: boolean = false;
  calendar = {
    sameDay: '[Today] ha',
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
    private toastService: ToastProvider,
    private userService: UserProvider,
    private subjectService: SubjectProvider,
    private evaluationService: EvaluationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.getEvaluations();
  }

  getData() {
    this.evaluationService.getClassListData()
      .then(result => {
        if (result) {
          result.subscribe(data => {
            _.forEach(data, async element => {
              var subjectIndex = _.findIndex(this.evaluations, ['subjectId', element.subjectId]);
              var teacherIndex = _.findIndex(this.evaluations, ['teacherId', element.teacherId]);
              if (subjectIndex != -1 && teacherIndex != -1) {
                element.isCompleted = true;
              }
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
            // this.data = _.filter(this.data, element => {
            //   var subjectIndex = _.findIndex(this.evaluations, ['subjectId', element.subjectId]);
            //   var teacherIndex = _.findIndex(this.evaluations, ['teacherId', element.teacherId]);
            //   if (subjectIndex == -1 && teacherIndex == -1) {
            //     return element;
            //   }
            // })
            this.backupData = data;
            console.log('Class list:', this.data);
            this.isLoading = false;
            if (data.length == 0) {
              this.isEmpty = true;
            }
            else {
              this.isEmpty = false;
            }
          })
        }
      }, error => {
        console.log(error);
        this.isLoading = false;
      })
  }

  getEvaluations() {
    this.evaluationService.getEvaluationsData()
      .then(result => {
        if (result) {
          result.subscribe(data => {
            this.evaluations = data;
            console.log('Evaluations:', this.evaluations)
            this.getData();
          })
        }
      })
  }

  async appendData(data) {
    await this.teachers.push(data);
  }

  view(data) {
    if (data.isCompleted) {
      this.toastService.presentToast('You are only allowed to evaluate this teacher once.');
    }
    else {
      this.modalCtrl.create('EvaluationPage', { data: data }).present();
    }
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