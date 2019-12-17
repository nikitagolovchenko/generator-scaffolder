import openClose from './components/openClose';

jQuery(function() {
  openClose();

  [1, 2, 3].map(item => console.log(item));

  console.log('INDEX');

  console.log('3');

  document.body.classList.add('test');

  document.body.classList.remove('test');

  test();
});

function test() {
  console.log('test 333');
}
