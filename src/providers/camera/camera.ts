import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()
export class CameraProvider {

  constructor(private camera: Camera) {
  }

  getPicture(type) {
    var options: CameraOptions = {
      quality: 50,
      targetWidth: 512,
      targetHeight: 512,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: type,
      allowEdit: false,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    return this.camera.getPicture(options);
  }

}
