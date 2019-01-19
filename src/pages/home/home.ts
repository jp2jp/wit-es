import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  data: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.getData();
  }
  
  getData() {
    this.data = [
      {
        name: 'Sarah Munting Prinsesa',
        position: 'Faculty',
        department: 'IT Department',
        image: './assets/imgs/1.jpg'
      },
      {
        name: 'Becky Potato',
        position: 'Faculty',
        department: 'Engineering Department',
        image: './assets/imgs/2.jpg'
      },
      {
        name: 'Tom Sawyer',
        position: 'Faculty',
        department: 'Arts Department',
        image: './assets/imgs/3.jpg'
      },
      {
        name: 'Miss Minchin',
        position: 'Faculty',
        department: 'Education Department',
        image: './assets/imgs/4.jpg'
      },
      {
        name: 'Lavinia Maldita',
        position: 'Faculty',
        department: 'CBA Department',
        image: './assets/imgs/5.jpg'
      }
    ]
  }

}