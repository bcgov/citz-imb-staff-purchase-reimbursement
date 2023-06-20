import { Button } from '@mui/material';
import { buttonStyles } from './ButtonStyles';
import { useNavigate } from 'react-router-dom';

/**
 * @interface
 * @description Interface for Back Button properties.
 * @property {boolean} disabled  - Optional: Whether the button should be in a disabled state.
 */
interface BackButtonProps {
  disabled?: boolean;
}

/**
 * @description A button that always goes one step back in browser.
 * @param {BackButtonProps} props Properties matching the BackButtonProps interface.
 * @returns A React Button element.
 */
const BackButton = (props: BackButtonProps) => {
  const { disabled } = props;

  const navigate = useNavigate();

  return (
    <Button
      variant='contained'
      disabled={disabled}
      sx={buttonStyles.secondary}
      onClick={() => {
        sessionStorage.removeItem('target-page'); // Otherwise there can be strange affects with redirect.
        navigate(-1);
      }}
      aria-label='Back Button'
      aria-aria-description='A button that sends the user back one page.'
      tabIndex={0}
    >
      Back
    </Button>
  );
};

export default BackButton;
