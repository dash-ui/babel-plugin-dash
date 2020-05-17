import styles from '../../styles'

// "html{display:flex;}"
const variant0 = styles.global('html { display: flex; } ')
// "html{color:"+color.red+";}"
const variant1 = styles.global(
  ({color}) => `
    html {
      color: ${color.red};
    }
  `
)
// {html: {color: color.blue}}
const variant2 = styles.global({
  html: {
    color: color.blue,
  },
})
// "html{color:"+color.yellow+";}"
const variant3 = styles.global(({color}) => {
  return `
    html { 
      color: ${color.yellow}; 
    }
  `
})
// "html{color:"+color.green+";}"
const variant4 = styles.global(({color}) => {
  return {
    html: {
      color: color.green,
    },
  }
})
// if (IS_PROD) return "html{color:"+color.pink+";}"
// return "html{color:"+color.yellow+";}"
const variant5 = styles.global(({color}) => {
  if (IS_PROD) {
    return `html { color: ${color.pink}; }`
  }
  return `html { color: ${color.yellow}; }`
})
// if (IS_PROD) return "html{color:"+color.lightBlue+";}"
// return "html{color:"+color.yellow+";}"

const variant6 = styles.global(({color}) => {
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
const variant7 = styles.global(({vh}) => {
  return {
    html: {
      height: vh,
    },
  }
})
