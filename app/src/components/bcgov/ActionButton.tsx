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
 */
interface ActionButtonProps {
  children: ReactNode,
  style: object,
  disabled?: boolean,
  handler: React.MouseEventHandler
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
    handler
  } = props;

  return (
    <Button 
      variant='contained' 
      onClick={handler} 
      sx={style} 
      disabled={disabled}>
        {children}
    </Button>
  );
}

export default ActionButton;
