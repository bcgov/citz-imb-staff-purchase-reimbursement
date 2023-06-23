import { Button } from '@mui/material';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * @interface
 * @description Interface for Link Button properties.
 * @property {ReactNode}  children  - Internal elements within the Button.
 * @property {string}     link      - The URL the button redirects to.
 * @property {object}     style     - The style applied to the button.
 * @property {boolean}    disabled  - Optional: Whether the button should be in a disabled state.
 * @property {string}     ariaDescription - Optional: Text description of what button does.
 * @property {boolean}    newTab    - Optional: If the link should open in a new tab.
 */
interface LinkButtonProps {
  children: ReactNode;
  link: string;
  style: object;
  disabled?: boolean;
  ariaDescription?: string;
  newTab?: boolean;
}

/**
 * @description A button that redirects to a supplied link.
 * @param {LinkButtonProps} props Properties matching the LinkButtonProps interface.
 * @returns A React Button element.
 */
const LinkButton = (props: LinkButtonProps) => {
  const { children, link, style, disabled, ariaDescription, newTab } = props;

  return (
    <Button
      variant='contained'
      component={Link}
      to={link}
      sx={style}
      disabled={disabled}
      aria-label='Follows link noted in description.'
      aria-description={ariaDescription}
      tabIndex={0}
      target={newTab ? '_blank' : '_self'}
    >
      {children}
    </Button>
  );
};

export default LinkButton;
