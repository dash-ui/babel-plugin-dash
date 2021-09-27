import { styles } from "@dash-ui/styles";

// "display:flex;"
const variant = styles.cls`display: flex;`;
// "display:flex;"
const variant0 = styles.cls("display: flex;");
// "color:"+color.red+";"
const variant1 = styles.cls(
  ({ color }) => `
    color: ${color.red};
  `
);
// {color: color.blue}
const variant2 = styles.cls({
  color: color.blue,
});
// "color:"+color.yellow+";"
const variant3 = styles.cls(({ color }) => {
  return `color: ${color.yellow};`;
});
// "color:"+color.green+";"
const variant4 = styles.cls(({ color }) => {
  return {
    color: color.green,
  };
});
// if (IS_PROD) return "color:"+color.pink+";"
// return "color:"+color.yellow+";"
const variant5 = styles.cls(({ color }) => {
  if (IS_PROD) {
    return `color: ${color.pink};`;
  }
  return `color: ${color.yellow};`;
});
// if (IS_PROD) return "color:"+color.lightBlue+";"
// return "color:"+color.yellow+";"

const variant6 = styles.cls(({ color }) => {
  if (IS_PROD) {
    return {
      color: color.lightBlue,
    };
  }
  return {
    color: color.yellow,
  };
});
// return "height"+vh+";"
const variant7 = styles.cls(({ vh }) => {
  return {
    height: vh,
  };
});
