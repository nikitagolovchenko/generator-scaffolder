import ready, {BODY, HTML} from './utils/global';

ready(() => {
  BODY.classList.add('test');
  HTML.classList.add('is-loaded');
});
