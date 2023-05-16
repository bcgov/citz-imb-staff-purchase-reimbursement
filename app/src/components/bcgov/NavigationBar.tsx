import { bcgov } from "../../constants/colours";
import { headerFont } from "../../constants/fonts";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const headerStyle : React.CSSProperties = {
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
}

const headerTextStyle : React.CSSProperties = {
  margin: '5px 5px 0 18px',
  fontWeight: 'normal',
  fontFamily: headerFont.fontFamily,
  display: 'inline',
}

const bannerStyle : React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  margin: '0 10px 0 0'
}

const NavigationBar = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <header style={headerStyle}>
      <div style={bannerStyle}>
        <a href="https://gov.bc.ca">
          <img src="/logo-banner.svg" alt="Go to the Government of British Columbia website" style={{
            height: '45px'
          }}/>
        </a>
        <h1 style={{ ...headerTextStyle, fontSize: matches ? '30px' : '18px' }}>Staff Purchase Reimbursement</h1>
      </div>
      <div>
      {
        // This place is for anything that needs to be right aligned within the header.
      }
      </div>
    </header>
  );
}

export default NavigationBar;
