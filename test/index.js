describe('Markup Only tests', () => {
  require('./markupOnly/m_noFrames_noLint');
  require('./markupOnly/m_TB_noLint');
  require('./markupOnly/m_Zurb_noLint');
  require('./markupOnly/m_materialize_noLint');

  after(function () {
    console.log("after all tests");
  });
})
