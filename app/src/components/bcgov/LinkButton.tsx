import {
  Button
} from '@mui/material';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LinkButtonProps {
  children: ReactNode,
  link: string,
  style: object
}

const LinkButton = (props: LinkButtonProps) => {
  const {
    children,
    link,
    style
  } = props;

  return <Button variant='contained' component={Link} to={link} sx={style}>{children}</Button>;
}

export default LinkButton;
