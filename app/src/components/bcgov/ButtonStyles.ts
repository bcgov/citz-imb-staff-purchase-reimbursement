import { bcgov } from "../../constants/colours";
import { normalFont } from "../../constants/fonts";

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
    color: bcgov.white
  }
}

/**
 * @constant
 * @description Button styles that build off of commonButtonStyle. Contains a .primary and .secondary styling.
 */
export const buttonStyles = {
  primary: {
    ...commonButtonStyle,      
    backgroundColor: bcgov.primary,
    color: bcgov.white,
  
    disabled: {
      ...commonButtonStyle,
      backgroundColor: bcgov.white
    }
  },
  secondary: {
      ...commonButtonStyle,       
      backgroundColor: bcgov.white,
      border: `1px solid ${bcgov.links}`,
      color: bcgov.text,
    },
};
