import { inject } from 'denali';

export default {

  files: inject('service:files'),

  respond(params) {
    return this.files.destroy(params.id).then(() => {
      this.response.send(200);
    });
  }

};
