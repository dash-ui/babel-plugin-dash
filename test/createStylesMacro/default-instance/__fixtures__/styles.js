import {styles} from '@dash-ui/styles'

const cls = styles({
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
  // return "height:"+vh+";"
  vh: ({vh}) => {
    return {
      height: vh,
    }
  },
  // return ".foo{height:"+vh+"};"
  vh: ({vh}) => {
    return {
      '.foo': {
        height: vh,
      },
    }
  },
  // Should minify
  vh: ({vh}) => {
    return {
      '.foo': {
        height: vh + ' 100vh' + 'foo' + ('foo' + 'bar'),
      },
    }
  },
  // Should not minify
  vh: ({vh}) => {
    return {
      '.foo': {
        height: vh + ' 100vh' + 'foo' + ('foo' + (() => {})),
      },
    }
  },
  default: ({pad, radius, transition}) => ({
    position: 'absolute',
    pointerEvents: 'none',
    display: 'grid',
    gridTemplateColumns: `${pad.sm} max-content 1fr`,
    height: '100%',
    width: '100%',
    color: 'currentColor',
    borderRadius: radius.primary,
    transitionProperty: 'box-shadow',
    transitionDuration: transition.duration.fast,
    transitionTimingFunction: transition.timing.inOut,

    '> span': {
      height: '100%',
      width: '100%',
      border: `1px solid currentColor`,
      transitionProperty: 'border-color, border-width',
      transitionDuration: transition.duration.fast,
      transitionTimingFunction: transition.timing.inOut,

      ':nth-child(1)': {
        borderRightWidth: 0,
        borderRadius: `${radius.primary} 0 0 ${radius.primary}`,
      },

      ':nth-child(2)': {
        display: 'flex',
        alignItems: 'center',
        borderRightWidth: 0,
        borderLeftWidth: 0,
        padding: `0 ${pad.sm}`,
      },

      ':nth-child(3)': {
        borderLeftWidth: 0,
        borderRadius: `0 ${radius.primary} ${radius.primary} 0`,
      },
    },
  }),

  focused: ({elevation}) => ({
    boxShadow: elevation.md,

    '> span': {
      borderBottomWidth: 2,
    },
  }),

  hasValue: ({font}) => ({
    fontWeight: 400,
    fontSize: font.size.xs,
    transform: `translateY(-1.618em)`,
  }),

  hasValue: ({font}) => ({
    fontWeight: 400,
    fontSize: font.size.xs,
    transform: `translateY(-1.618em)` + foo('bar'),
  }),

  hasValue3: ({font}) => ({
    fontWeight: 400,
    fontSize: font.size.xs,
    transform: foo('bar'),
    '.Last-Time': {
      foo: 'bar',
    },
    '--foo': 'bar',
  }),
})
