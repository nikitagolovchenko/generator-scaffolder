describe('Markup Only tests', () => {
  require('./markupOnly/m_noFrames_noLint');
  require('./markupOnly/m_TB_noLint');

  after(function () {
    console.log("after all tests");
  });
})
