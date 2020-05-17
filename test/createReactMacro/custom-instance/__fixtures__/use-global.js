import {useGlobal} from '../../../../src/react'

// useGlobal("html{display:flex;}")
const variant = useGlobal`html { display: flex; } `
// useGlobal("html{display:flex;}")
const variant0 = useGlobal('html { display: flex; } ')
// "html{color:"+color.red+";}"
const variant1 = useGlobal(
  ({color}) => `
    html {
      color: ${color.red};
    }
  `
)
// {html: {color: color.blue}}
const variant2 = useGlobal({
  html: {
    color: color.blue,
  },
})
// "html{color:"+color.yellow+";}"
const variant3 = useGlobal(({color}) => {
  return `
    html { 
      color: ${color.yellow}; 
    }
  `
})
// "html{color:"+color.green+";}"
const variant4 = useGlobal(({color}) => {
  return {
    html: {
      color: color.green,
    },
  }
})
// if (IS_PROD) return "html{color:"+color.pink+";}"
// return "html{color:"+color.yellow+";}"
const variant5 = useGlobal(({color}) => {
  if (IS_PROD) {
    return `html { color: ${color.pink}; }`
  }
  return `html { color: ${color.yellow}; }`
})
// if (IS_PROD) return "html{color:"+color.lightBlue+";}"
// return "html{color:"+color.yellow+";}"

const variant6 = useGlobal(({color}) => {
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
const variant7 = useGlobal(({vh}) => {
  return {
    html: {
      height: vh,
    },
  }
})
