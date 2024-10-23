import main from './main';
import pages from './pages';
import device from './device';
import validation from './validation';
import auth from './auth';

export default {
  ...main,
  ...auth,
  ...pages,
  ...device,
  ...validation,
};
