import { Initializer, inject } from 'denali';
import url from 'url';
import mkdirp from 'mkdirp';
import staticServer from 'node-static';
import http from 'http';

export default Initializer.extend({
  config: inject('config:environment'),
  initialize() {
    if (this.config.files.store.type === 'local') {
      let config = this.config.files.store;
      mkdirp.sync(config.dir);
      let fileServer = new staticServer.Server(config.dir);
      http.createServer((req, res) => {
        req.addListener('end', () => {
          fileServer.serve(req, res);
        }).resume();
      }).listen(url.parse(config.host).port);
    }
  }
});
