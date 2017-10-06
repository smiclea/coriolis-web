import { css } from 'styled-components'

const StyleProps = {
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '600',
  },

  borderRadius: '4px',

  animations: {
    swift: '.45s cubic-bezier(0.3, 1, 0.4, 1) 0s;',
  },

  media: {
    handheld: (...args) => css`
      @media (max-height: 760px) { 
        ${css(...args)}
      }
    `,
  },
}

export default StyleProps
