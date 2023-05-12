import { bcgov } from "../../constants/colours";
import { normalFont } from "../../constants/fonts";

export const buttonStyles = {
  primary: {
      ...normalFont,
      backgroundColor: bcgov.primary,
      borderRadius: '4px',
      color: bcgov.white,
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
    },
    '&:disabled': {
      background: 'white'
    }
  },
  secondary: {
      ...normalFont,
      backgroundColor: bcgov.white,
      border: `1px solid ${bcgov.links}`,
      borderRadius: '4px',
      color: bcgov.text,
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
    },
  }
};
