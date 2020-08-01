import {responsiveStyles} from '../../../../src/responsive'

const cls = responsiveStyles({
  // display:flex;
  default: 'display: flex;',
  // "color:"+color.red+";"
  colorRed: ({color}) => `
    color: ${color.red};
  `,
  // "color:"+color.blue+";"
  colorBlue: ({color}) => ({
    color: color.blue,
  }),
  // "color:"+color.yellow+";"
  colorYellow: ({color}) => {
    return `color: ${color.yellow};`
  },
  // "color:"+color.green+";"
  colorGreen: ({color}) => {
    return {
      color: color.green,
    }
  },
  // if (IS_PROD) return "color:"+color.pink+";"
  // return "color:"+color.yellow+";"
  colorProdPink: ({color}) => {
    if (IS_PROD) {
      return `color: ${color.pink};`
    }
    return `color: ${color.yellow};`
  },
  // if (IS_PROD) return "color:"+color.lightBlue+";"
  // return "color:"+color.yellow+";"
  colorLightBlue: ({color}) => {
    if (IS_PROD) {
      return {
        color: color.lightBlue,
      }
    }
    return {
      color: color.yellow,
    }
  },
  // return "color:"+color.font.yellow+";"
  colorFontYellow: ({color}) => {
    return {
      color: color.font.bath.yellow,
    }
  },
  // return "height"+vh+";"
  vh: ({vh}) => {
    return {
      height: vh,
    }
  },
})
