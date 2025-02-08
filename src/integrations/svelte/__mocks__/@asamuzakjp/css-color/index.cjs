const cssColor = {
  convert: () => '#000000',
  resolve: () => '#000000',
  util: {
    isValidColor: () => true,
    getColorType: () => 'rgb',
    getRgbObj: () => ({ r: 0, g: 0, b: 0, a: 1 }),
    getHslObj: () => ({ h: 0, s: 0, l: 0, a: 1 }),
    getHwbObj: () => ({ h: 0, w: 0, b: 0, a: 1 }),
    getLchObj: () => ({ l: 0, c: 0, h: 0, a: 1 }),
    getLabObj: () => ({ l: 0, a: 0, b: 0, alpha: 1 })
  }
};

module.exports = cssColor;
