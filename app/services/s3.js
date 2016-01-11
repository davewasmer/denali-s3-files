import { Factory, inject } from 'denali';
import AWS from 'aws-sdk';

export default Factory.extend({
  config: inject('config:environment'),
  build() {
    return new AWS.S3(this.config.files.store);
  }
});
