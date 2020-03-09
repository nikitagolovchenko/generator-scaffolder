describe('Markup', () => {
  require('./markupOnly/noFrames_noLint');
  require('./markupOnly/TB_noLint');
  require('./markupOnly/Zurb_noLint');
  require('./markupOnly/materialize_noLint');
  require('./markupOnly/tailwind_noLint');

  after(function () {
    console.log("after all tests");
  });
})
