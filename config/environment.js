import assert from 'assert';

export default function environmentConfig(environment, appConfig) {

  assert(appConfig.files, 'Missing files config object!');
  assert(appConfig.files.store, 'Missing file store config!');

}
