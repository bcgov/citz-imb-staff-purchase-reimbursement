import { bcgov } from '../../constants/colours';
import { normalFont } from '../../constants/fonts';

/**
 * @constant
 * @description The common button styling.
 */
const commonButtonStyle = {
  ...normalFont,
  borderRadius: '4px',
  padding: '12px 24px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '700',
  letterSpacing: '1px',
  cursor: 'pointer',
  '&:hover': {
    background: bcgov.links,
    color: bcgov.white,
  },
};

const primary = {
  ...commonButtonStyle,
  backgroundColor: bcgov.primary,
  color: bcgov.white,

  disabled: {
    ...commonButtonStyle,
    backgroundColor: bcgov.white,
  },
};

const secondary = {
  ...commonButtonStyle,
  backgroundColor: bcgov.white,
  border: `1px solid ${bcgov.links}`,
  color: bcgov.text,
};

const smallSecondary = {
  ...commonButtonStyle,
  backgroundColor: bcgov.white,
  border: `1px solid ${bcgov.links}`,
  color: bcgov.text,
  width: '1em',
  height: '2em',
  padding: '0.25em',
  margin: '0 0.5em',
};

const warning = {
  ...commonButtonStyle,
  backgroundColor: bcgov.white,
  color: bcgov.error,
  border: `1px solid ${bcgov.error}`,
  '&:hover': {
    background: bcgov.error,
    color: bcgov.white,
  },
};

/**
 * @constant
 * @description Button styles that build off of commonButtonStyle. Contains a .primary and .secondary styling.
 */
export const buttonStyles = {
  primary,
  secondary,
  smallSecondary,
  warning,
};
