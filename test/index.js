describe('Markup', () => {
  require('./markupOnly/default');
  require('./markupOnly/bootstrap');
  require('./markupOnly/zurb');
  require('./markupOnly/materialize');
  require('./markupOnly/tailwind');

  after(function () {
    console.log("after all tests");
  });
})
