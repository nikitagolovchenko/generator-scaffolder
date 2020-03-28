import ready, {BODY, HTML} from 'Utils/global';

ready(() => {
  BODY.classList.add('test');
  HTML.classList.add('is-loaded');
});
