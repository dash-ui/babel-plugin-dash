import styles from '@dash-ui/styles'

// "0%{opacity:0;}"
const variant0 = styles.keyframes('0% { opacity: 0; } ')
// "0%{opacity:0;}100%{opacity:1;}"
const variant1 = styles.keyframes(
  () => `
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1
    }
  `
)
// no cahnge
const variant2 = styles.keyframes({
  '0%': {
    opacity: opacity,
  },
})
// "0%{opacity:"+opacity.none+";}100%{opacity:"+opacity.some+";}"
const variant3 = styles.keyframes(({opacity}) => {
  return `
    0% {
      opacity: ${opacity.none};
    }
    100% {
      opacity: ${opacity.some};
    }
  `
})
// "0%{opacity:"+opacity.none+";}100%{opacity:"+opacity.some+";}"
const variant4 = styles.keyframes(({opacity}) => {
  return {
    '0%': {
      opacity: opacity.none,
    },
    '100%': {
      opacity: opacity.some,
    },
  }
})
// if (IS_PROD) return "0%{opacity:"+opacity.none+";}"
// return "0%{opacity:"+opacity.some+";}"
const variant5 = styles.keyframes(({opacity}) => {
  if (IS_PROD) {
    return `0% { opacity: ${opacity.none}; }`
  }
  return `0% { opacity: ${opacity.some}; }`
})
// if (IS_PROD) return "0%{color:"+color.lightBlue+";}"
// return "0%{color:"+color.yellow+";}"
const variant6 = styles.keyframes(({color}) => {
  if (IS_PROD) {
    return {
      '0%': {
        color: color.lightBlue,
      },
    }
  }
  return {
    '0%': {
      color: color.yellow,
    },
  }
})
// return "0%{height:"+vh+";}100%{height:100px;}"
const variant7 = styles.keyframes(({vh}) => {
  return {
    '0%': {
      height: vh,
    },
    '100%': {
      height: 100,
    },
  }
})
