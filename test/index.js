describe('Markup', () => {
  require('./markupOnly/m_noFrames_noLint');
  require('./markupOnly/m_TB_noLint');
  require('./markupOnly/m_Zurb_noLint');
  require('./markupOnly/m_materialize_noLint');
  require('./markupOnly/m_tailwind_noLint');

  after(function () {
    console.log("after all tests");
  });
})
