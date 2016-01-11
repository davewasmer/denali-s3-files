import { Service, inject } from 'denali';
import moment from 'moment';
import camelCase from 'lodash/string/camelCase';
import fs from 'fs';
import path from 'path';

export default Service.extend({

  s3: inject('service:s3'),
  config: inject('config:environment'),

  upload(stream, mimetype, filename) {
    let type = this.config.files.store.type;
    let methodName = camelCase('upload-to-' + type);
    return this[methodName](stream, mimetype, filename);
  },

  destroy(filename) {
    let type = this.config.files.store.type;
    let methodName = camelCase('destroy-from-' + type);
    return this[methodName](filename);
  },

  uploadToS3(stream, mimetype, filename) {
    let config = this.config.files.store;
    return new Promise((resolve, reject) => {
      this.s3.upload({
        ACL: 'public-read',
        Body: stream,
        Bucket: config.store.bucket,
        ContentType: mimetype,
        Expires: moment().add(1, 'year'),
        Key: this.environment + '/' + filename
      }, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.Location);
      });
    });
  },

  destroyFromS3(filename) {
    let config = this.config.files.store;
    return new Promise((resolve, reject) => {
      this.s3.deleteObject({
        Bucket: config.bucket,
        Key: this.environment + '/' + filename
      }, (err) => {
        if (err) {
          return reject();
        }
        resolve();
      });
    });
  },

  uploadToLocal(stream, mimetype, filename) {
    let config = this.config.files.store;
    return new Promise((resolve, reject) => {
      let dest = fs.createWriteStream(path.join(config.dir, filename));
      stream.pipe(dest);
      stream.on('end', () => {
        resolve(config.host + '/' + filename);
      });
      stream.on('error', (e) => {
        reject(e);
      });
    });
  },

  destroyFromLocal(filename) {
    let config = this.config.files.store;
    return new Promise((resolve, reject) => {
      fs.unlink(path.join(config.dir, filename), (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

});
