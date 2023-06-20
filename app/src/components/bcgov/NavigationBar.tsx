import { bcgov } from '../../constants/colours';
import { headerFont } from '../../constants/fonts';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import UserControl from '../custom/login/UserControl';
import { Link } from 'react-router-dom';
import { CSSProperties } from 'react';

// Styles the header bar
const headerStyle: CSSProperties = {
  backgroundColor: bcgov.header,
  borderBottom: `2px solid ${bcgov.primaryHighlight}`,
  color: bcgov.white,
  display: 'flex',
  justifyContent: 'space-between',
  height: '65px',
  width: '100vw',
  top: '0px',
  left: '0px',
  position: 'fixed',
  padding: '0 1em',
  zIndex: 100,
};

//  Styles the header text
const headerTextStyle: CSSProperties = {
  margin: '5px 5px 0 18px',
  fontWeight: 'normal',
  fontFamily: headerFont.fontFamily,
  display: 'inline',
};

// Styles the logo (banner)
const bannerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  margin: '0 10px 0 0',
};

/**
 * @description The navigation bar displayed at the top of every page.
 * @returns A React element.
 */
const NavigationBar = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <header style={headerStyle} aria-label='The site navigation header.'>
      <div style={bannerStyle}>
        <a href='https://gov.bc.ca'>
          <img
            src='/logo-banner.svg'
            alt='Go to the Government of British Columbia website'
            style={{
              height: '45px',
            }}
          />
        </a>
        <Link
          to='/'
          style={{ textDecoration: 'none', color: bcgov.white }}
          aria-label='Staff Purchase Reimbursement'
          aria-description='Sends the user back to the main page when clicked.'
        >
          <h1
            style={{ ...headerTextStyle, fontSize: matches ? '30px' : '18px', cursor: 'pointer' }}
          >
            Staff Purchase Reimbursement
          </h1>
        </Link>
      </div>
      <div
        style={{
          minWidth: '150px',
          display: 'flex',
          justifyContent: 'flex-end',
          marginRight: '2em',
          padding: '0.8em 0 0.4em 0',
        }}
      >
        {
          // This place is for anything that needs to be right aligned within the header.
        }
        <UserControl />
      </div>
    </header>
  );
};

export default NavigationBar;
