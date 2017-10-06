import RubikRegular from './Rubik-Regular.woff'
import RubikItalic from './Rubik-Italic.woff'
import RubikBold from './Rubik-Bold.woff'
import RubikLight from './Rubik-Light.woff'
import RubikLightItalic from './Rubik-LightItalic.woff'
import RubikMedium from './Rubik-Medium.woff'
import RubikMediumItalic from './Rubik-MediumItalic.woff'

const Fonts = `
  @font-face {
    font-family: 'Rubik';
    src: url('${RubikRegular}') format('woff');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Rubik';
    src: url('${RubikItalic}') format('woff');
    font-weight: 400;
    font-style: italic;
  }

  @font-face {
    font-family: 'Rubik';
    src: url('${RubikBold}') format('woff');
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: 'Rubik';
    src: url('${RubikLight}') format('woff');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'Rubik';
    src: url('${RubikLightItalic}') format('woff');
    font-weight: 300;
    font-style: italic;
  }

  @font-face {
    font-family: 'Rubik';
    src: url('${RubikMedium}') format('woff');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'Rubik';
    src: url('${RubikMediumItalic}') format('woff');
    font-weight: 500;
    font-style: italic;
  }
`

export default Fonts
