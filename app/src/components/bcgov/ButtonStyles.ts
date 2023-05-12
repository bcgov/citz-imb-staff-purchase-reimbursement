import { bcgov } from "../../constants/colours";
import { normalFont } from "../../constants/fonts";

const commonButtonStyle = {
    ...normalFont,
    borderRadius: '4px',
    padding: '12px 24px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '1px',
    cursor: 'pointer',
  '&:hover': {
    background: bcgov.links,
    color: bcgov.white
  }
}

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
