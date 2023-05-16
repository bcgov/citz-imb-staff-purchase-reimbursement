import {
  Button
} from '@mui/material';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LinkButtonProps {
  children: ReactNode,
  link: string,
  style: object,
  disabled?: boolean
}

const LinkButton = (props: LinkButtonProps) => {
  const {
    children,
    link,
    style,
    disabled
  } = props;

  return <Button variant='contained' component={Link} to={link} sx={style} disabled={disabled}>{children}</Button>;
}

export default LinkButton;
