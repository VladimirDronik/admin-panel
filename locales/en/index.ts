import main from './main';
import auth from './auth';
import pages from './pages';
import error from './error';
import device from './device';
import validation from './validation';

export default {
  ...main,
  ...auth,
  ...error,
  ...pages,
  ...device,
  ...validation,
};
