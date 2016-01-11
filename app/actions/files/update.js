import { Action, Errors } from 'denali';

export default Action.extend({

  respond() {
    this.render(new Errors.MethodNotAllowed());
  }

});
