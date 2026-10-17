const path = require('node:path');
const ICON_PATH = path.join(__dirname, '../assets/branding/weroam-icon.png');
function createTrayIcons(nativeImage) {
  const image = nativeImage.createFromPath(ICON_PATH);
  if (image.isEmpty()) throw new Error('Unable to decode the WeRoam icon.');
  const normal = image.resize({width: 16, height: 16, quality: 'best'});
  const blank = nativeImage.createFromBitmap(Buffer.alloc(16 * 16 * 4), {width: 16, height: 16});
  return {normal, blank};
}
module.exports = {ICON_PATH, createTrayIcons};
