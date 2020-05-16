import styles from '../styles'

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
  grid: {
    display: 'grid',
  },
  grid2: {
    display: grid2,
  },
})

const clsOne = styles.one`
  display: ${flex};
`
