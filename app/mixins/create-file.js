import { inject } from 'denali';
import Busboy from 'busboy';
import Promise from 'bluebird';
import uuid from 'node-uuid';

export default {

  files: inject('service:files'),

  respond() {
    return new Promise((resolve, reject) => {
      let busboy = new Busboy({ headers: this.request.headers });
      busboy.on('file', (fieldname, stream, filename, encoding, mimetype) => {
        let uniqueFilename = uuid() + '.' + filename.split('.').pop();
        this.files.upload(stream, mimetype, uniqueFilename).then((url) => {
          this.response.set('Location', url);
          this.response.sendStatus(201);
        }).catch(reject);
      });
      this.request.pipe(busboy);
    });
  }

};
