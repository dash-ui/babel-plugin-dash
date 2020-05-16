import styles from '@dash-ui/styles'

const flex = 'flex'
const grid2 = 'grid'

const cls = styles({
  default: 'display: block;',
  flex: `
    display: ${flex};
    @media (min-width: 300px) {
      flex-direction: column;
    }
  `,
  flex2: ({color: {blue}}) => ({
    color: blue,
  }),
  flex3: ({flex}) => ({
    display: flex,
  }),
  flex4: ({flex}) => `display: ${flex};`,
  flex5: () => ({
    display: 'flex',
  }),
  flex6: ({flex}) => {
    if (!flex) {
      return {
        display: 'block',
      }
    } else if (true) {
      return {
        display: 'fish',
      }
    } else {
      return {
        display: 'fish',
      }
    }

    return {
      display: flex,
    }
  },
  flex7: ({flex}) => {
    return flex
      ? {
          display: flex,
        }
      : {
          display: 'block',
        }
  },
  flex8: ({flex}) =>
    flex
      ? {
          display: flex,
        }
      : {
          display: 'block',
        },
  grid: {
    display: 'grid',
  },
  grid2: {
    display: grid2,
  },
  media: {
    '@media (min-width: 1280px)': {
      display: 'block',
    },
  },
})

const clsOne = styles.one`
  display: ${flex};
`

const clsTwo = styles.one(`
  display: ${flex};
`)

const clsThree = styles.one(
  () => `
    display: ${flex};
  `
)

const clsFour = styles.one({display: 'flex'})

const clsFive = styles.one('display: flex;')
const clsSix = styles.one({display: flex})
const clsSeven = styles.one(
  ({flex}) => `
    display: ${flex};
  `
)
const clsEight = styles.keyframes(
  ({flex}) => `
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  `
)
