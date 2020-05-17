import styles from '@dash-ui/styles'

// "display:flex;"
const variant0 = styles.one('display: flex;')
// "color:"+color.red+";"
const variant1 = styles.one(
  ({color}) => `
    color: ${color.red};
  `
)
// {color: color.blue}
const variant2 = styles.one({
  color: color.blue,
})
// "color:"+color.yellow+";"
const variant3 = styles.one(({color}) => {
  return `color: ${color.yellow};`
})
// "color:"+color.green+";"
const variant4 = styles.one(({color}) => {
  return {
    color: color.green,
  }
})
// if (IS_PROD) return "color:"+color.pink+";"
// return "color:"+color.yellow+";"
const variant5 = styles.one(({color}) => {
  if (IS_PROD) {
    return `color: ${color.pink};`
  }
  return `color: ${color.yellow};`
})
// if (IS_PROD) return "color:"+color.lightBlue+";"
// return "color:"+color.yellow+";"

const variant6 = styles.one(({color}) => {
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
const variant7 = styles.one(({vh}) => {
  return {
    height: vh,
  }
})
