import {
  ReactNode,
  SyntheticEvent,
  createContext,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  CSSProperties,
} from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { bcgov } from '../../../constants/colours';
import { SnackbarContent } from '@mui/material';

interface IErrorWrapper {
  children: ReactNode;
}

interface ErrorState {
  text: string;
  open: boolean;
  style?: CSSProperties;
}

const initialState: ErrorState = {
  text: '',
  open: false,
};

const initialContext = {
  errorState: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setErrorState: (() => {}) as Dispatch<SetStateAction<ErrorState>>,
};

const errorStyles = {
  error: {
    backgroundColor: bcgov.error,
  } as CSSProperties,
  warning: {
    backgroundColor: bcgov.primaryHighlight,
    color: bcgov.text,
  } as CSSProperties,
};

export const ErrorContext = createContext(initialContext);

const ErrorWrapper = (props: IErrorWrapper) => {
  const [errorState, setErrorState] = useState(initialState);
  const value = useMemo(() => ({ errorState, setErrorState }), [errorState]);

  const { children } = props;

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorState({
      text: '',
      open: false,
    });
  };

  const action = (
    <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
      <CloseIcon fontSize='small' />
    </IconButton>
  );

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <Snackbar open={errorState.open} autoHideDuration={6000} onClose={handleClose}>
        <SnackbarContent
          sx={errorState.style || errorStyles.warning}
          message={errorState.text}
          action={action}
        />
      </Snackbar>
    </ErrorContext.Provider>
  );
};

export default ErrorWrapper;
