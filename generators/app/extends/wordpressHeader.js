const fs = require('fs');
const path = require('path');
const prependFile = require('prepend-file');
const {CONFIG, PATHS} = require('../globals');

function WPHeader({instance}) {
    const {name} = path.parse(instance.destinationPath()) || 'Base';
    const stylesFilePath = path.join(PATHS.destination, CONFIG.src, CONFIG.styles.src, `${CONFIG.styles.bundle}.${CONFIG.styles.extension}`)

    const WPHeaderTemplate = `
/*
  Theme Name: ${name}
  Author: Anonymous
  Author URI:
  Version: 1
  Description: ${name} theme for Wordpress
  License: GNU General Public License v2 or later
  License URI: http://www.gnu.org/licenses/gpl-2.0.html
  Text Domain: ${name.toLowerCase()}
  Tags: one-column, two-columns
  Theme URI:
*/


`
  return prependFile(instance.destinationPath(stylesFilePath), WPHeaderTemplate, err => {
    if (err) console.log(err)
  })
}

module.exports = WPHeader;
