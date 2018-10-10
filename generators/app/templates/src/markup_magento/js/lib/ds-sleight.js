// Universal transparent-PNG enabler for MSIE/Win 5.5+
// http://dsandler.org
// From original code: http://www.youngpup.net/?request=/snippets/sleight.xml
// and background-image code: http://www.allinthehead.com/retro/69
// also:
//  * use sizingMethod=crop to avoid scaling PNGs (who would do such a thing?)
//  * only do this once, to make it compatible with CSS rollovers

if (navigator.platform == 'Win32' && navigator.appName == 'Microsoft Internet Explorer' && window.attachEvent) {
  window.attachEvent('onload', enableAlphaImages);
}

function enableAlphaImages() {
  const rslt = navigator.appVersion.match(/MSIE (\d+\.\d+)/, '');
  const itsAllGood = rslt != null && Number(rslt[1]) >= 5.5;
  if (itsAllGood) {
    for (let i = 0; i < document.all.length; i++) {
      const obj = document.all[i];
      const bg = obj.currentStyle.backgroundImage;
      var img = document.images[i];
      if (bg && bg.match(/\.png/i) != null) {
        var img = bg.substring(5, bg.length - 2);
        const offset = obj.style['background-position'];
        obj.style.filter = `progid:DXImageTransform.Microsoft.AlphaImageLoader(src='${img}', sizingMethod='crop')`;
        obj.style.backgroundImage = `url('${BLANK_IMG}')`;
        obj.style['background-position'] = offset; // reapply
      } else if (img && img.src.match(/\.png$/i) != null) {
        const src = img.src;
        img.style.width = `${img.width}px`;
        img.style.height = `${img.height}px`;
        img.style.filter = `progid:DXImageTransform.Microsoft.AlphaImageLoader(src='${src}', sizingMethod='crop')`;
        img.src = BLANK_IMG;
      }
    }
  }
}
