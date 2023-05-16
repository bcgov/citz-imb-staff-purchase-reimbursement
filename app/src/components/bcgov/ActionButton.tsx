import {
  Button
} from '@mui/material';
import { ReactNode } from 'react';

interface ActionButtonProps {
  children: ReactNode,
  style: object,
  disabled?: boolean,
  handler: React.MouseEventHandler
}

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
