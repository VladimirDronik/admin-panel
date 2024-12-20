import main from './main';
import auth from './auth';
import pages from './pages';
import error from './error';
import video from './video';
import device from './device';
import script from './script';
import display from './display';
import validation from './validation';
import parameters from './parameters';

export default {
  ...main,
  ...auth,
  ...error,
  ...pages,
  ...video,
  ...device,
  ...script,
  ...display,
  ...validation,
  ...parameters,
};
