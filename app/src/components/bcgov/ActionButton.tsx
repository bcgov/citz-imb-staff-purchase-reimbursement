import {
  Button
} from '@mui/material';
import { ReactNode } from 'react';

/**
 * @interface
 * @description Interface for Action Button properties.
 * @property {ReactNode}                children  - Internal elements within the Button.
 * @property {React.MouseEventHandler}  handler   - The function the button will execute.
 * @property {object}                   style     - The style applied to the button.
 * @property {boolean}                  disabled  - Optional: Whether the button should be in a disabled state.
 * @property {string}                   ariaDescription - Optional: Text description of what button does.
 */
interface ActionButtonProps {
  children: ReactNode,
  style: object,
  disabled?: boolean,
  handler: React.MouseEventHandler,
  ariaDescription?: string
}

/**
 * @description A button that executes a supplied handler function.
 * @param {ActionButtonProps} props Properties matching the ActionButtonProps interface.
 * @returns A React Button element.
 */
const ActionButton = (props: ActionButtonProps) => {
  const {
    children,
    style,
    disabled,
    handler,
    ariaDescription
  } = props;

  return (
    <Button 
      variant='contained' 
      onClick={handler} 
      sx={style} 
      disabled={disabled}
      tabIndex={0}
      aria-label='Executes action noted in description.'
      aria-description={ariaDescription}
    >
        {children}
    </Button>
  );
}

export default ActionButton;
