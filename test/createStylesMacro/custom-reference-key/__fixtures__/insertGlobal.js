import {styles} from '../../../../src/styles'

// styles.insertGlobal("html{display:flex;}")
const variant = styles.insertGlobal`html { display: flex; }`
// "html{display:flex;}"
const variant0 = styles.insertGlobal('html { display: flex; } ')
// "html{color:"+color.red+";}"
const variant1 = styles.insertGlobal(
  ({color}) => `
    html {
      color: ${color.red};
    }
  `
)
// {html: {color: color.blue}}
const variant2 = styles.insertGlobal({
  html: {
    color: color.blue,
  },
})
// "html{color:"+color.yellow+";}"
const variant3 = styles.insertGlobal(({color}) => {
  return `
    html { 
      color: ${color.yellow}; 
    }
  `
})
// "html{color:"+color.green+";}"
const variant4 = styles.insertGlobal(({color}) => {
  return {
    html: {
      color: color.green,
    },
  }
})
// if (IS_PROD) return "html{color:"+color.pink+";}"
// return "html{color:"+color.yellow+";}"
const variant5 = styles.insertGlobal(({color}) => {
  if (IS_PROD) {
    return `html { color: ${color.pink}; }`
  }
  return `html { color: ${color.yellow}; }`
})
// if (IS_PROD) return "html{color:"+color.lightBlue+";}"
// return "html{color:"+color.yellow+";}"

const variant6 = styles.insertGlobal(({color}) => {
  if (IS_PROD) {
    return {
      html: {
        color: color.lightBlue,
      },
    }
  }
  return {
    html: {
      color: color.yellow,
    },
  }
})
// return "html{height"+vh+";}"
const variant7 = styles.insertGlobal(({vh}) => {
  return {
    html: {
      height: vh,
    },
  }
})
