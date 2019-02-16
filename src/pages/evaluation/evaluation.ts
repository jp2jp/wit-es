import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { QuestionsProvider } from '../../providers/questions/questions';
import { EvaluationProvider } from '../../providers/evaluation/evaluation';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { LoaderProvider } from '../../providers/loader/loader';
import { ToastProvider } from '../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-evaluation',
  templateUrl: 'evaluation.html',
})
export class EvaluationPage {

  data: any;
  uid: any;
  questions: any;
  isLoading: boolean = true;
  evaluation = [];
  allowSubmit: boolean = true;

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private loaderService: LoaderProvider,
    private toastService: ToastProvider,
    private localStorageService: LocalStorageProvider,
    private evaluationService: EvaluationProvider,
    private questionsService: QuestionsProvider) {
    this.data = navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EvaluationPage');
    console.log(this.data);
    this.getQuestions();
    this.getUid();
  }

  async getUid() {
    this.uid = await this.localStorageService.getToken();
  }

  getQuestions() {
    this.questionsService.getQuestions()
      .subscribe(data => {
        this.questions = data;
        console.log('Questions', this.questions);
        this.isLoading = false;
      })
  }

  select(value, id, index) {
    this.evaluation[index] = { [id]: value };
  }

  complete() {
    if (this.evaluation.length == this.questions.length) {
      const alert = this.alertCtrl.create({
        title: 'Confirm submission',
        message: 'Are you sure you want to submit this evaluation?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              console.log('Cancel');
            }
          },
          {
            text: 'Confirm',
            handler: () => {
              this.addEvaluation();
            }
          }
        ]
      });
      alert.present();
    }
    else {
      console.log('not yet completed')
      const denyAlert = this.alertCtrl.create({
        title: 'Submission denied',
        message: 'Complete all the questions first before submitting.',
        buttons: ['OK']
      });
      denyAlert.present();
    }
  }

  addEvaluation() {
    this.loaderService.present();
    var evaluation = {
      academicYear: this.data.academicYear,
      courseId: this.data.courseId,
      dateCreated: new Date(),
      departmentId: this.data.departmentId,
      evaluation: this.evaluation,
      semester: this.data.semester,
      studentId: this.uid,
      subjectId: this.data.subjectId,
      teacherId: this.data.subjectId
    }
    console.log(evaluation);
    this.evaluationService.addEvaluation(evaluation)
      .then(async result => {
        console.log(result);
        this.allowSubmit = false;
        await this.loaderService.dismiss();
        await this.toastService.presentToast('Submitting of evaluation success.');
        this.close();
      }, async error => {
        console.log(error);
        await this.loaderService.dismiss();
        this.toastService.presentToast('A problem occured while processing your request. Please try again.');
      })
  }

  close() {
    this.viewCtrl.dismiss();
  }

}