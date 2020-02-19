import 'what-input';
import 'foundation-sites';
import ready, {shuffle, delay, BODY, HTML} from 'Utils/global';
import animationTest from 'Animations/test';
import openClose from 'Components/openClose';

jQuery(document).foundation();

const delayTest = () => {
  console.log('Await test');
  delay(500);
  console.log('Await test 2');
  delay(500);
};

ready(async () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8];

  await delayTest();

  console.log('INDEX');
  arr.map(item => console.log(item));
  console.log('Shuffled array: ', shuffle(arr));

  BODY.classList.add('test');
  BODY.classList.remove('test');

  openClose();
  animationTest();

  HTML.classList.add('is-loaded');
});
