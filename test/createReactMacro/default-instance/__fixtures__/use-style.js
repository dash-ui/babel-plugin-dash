import {useStyle} from '@dash-ui/react'

// useStyle("display:flex;")
const variant = useStyle`display: flex;`
// "display:flex;"
const variant0 = useStyle('display: flex;')
// "color:"+color.red+";"
const variant1 = useStyle(
  ({color}) => `
    color: ${color.red};
  `
)
// {color: color.blue}
const variant2 = useStyle({
  color: color.blue,
})
// "color:"+color.yellow+";"
const variant3 = useStyle(({color}) => {
  return `color: ${color.yellow};`
})
// "color:"+color.green+";"
const variant4 = useStyle(({color}) => {
  return {
    color: color.green,
  }
})
// if (IS_PROD) return "color:"+color.pink+";"
// return "color:"+color.yellow+";"
const variant5 = useStyle(({color}) => {
  if (IS_PROD) {
    return `color: ${color.pink};`
  }
  return `color: ${color.yellow};`
})
// if (IS_PROD) return "color:"+color.lightBlue+";"
// return "color:"+color.yellow+";"

const variant6 = useStyle(({color}) => {
  if (IS_PROD) {
    return {
      color: color.lightBlue,
    }
  }
  return {
    color: color.yellow,
  }
})
// return "height"+vh+";"
const variant7 = useStyle(({vh}) => {
  return {
    height: vh,
  }
})
