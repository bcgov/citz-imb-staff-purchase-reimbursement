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

/**
 * @interface
 * @description Properties passed to ErrorWrapper.
 * @property {ReactNode} children The child elements within the ErrorWrapper.
 */
interface IErrorWrapper {
  children: ReactNode;
}

/**
 * @interface
 * @description Defines the properties of an Error State.
 * @property {string} text The text displayed in the notification.
 * @property {boolean} open Whether the notification is open and visible.
 * @property {CSSProperties} style Optional: Styling properties for the notification.
 */
interface ErrorState {
  text: string;
  open: boolean;
  style?: CSSProperties;
}

/**
 * @constant
 * @description The initial state of the component. ErrorState
 */
const initialState: ErrorState = {
  text: '',
  open: false,
};

/**
 * @constant
 * @description The initial context passed down from the context provider.
 */
const initialContext = {
  errorState: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setErrorState: (() => {}) as Dispatch<SetStateAction<ErrorState>>,
};

/**
 * @constant
 * @description An object containing styles for various types of error messages.
 */
export const errorStyles = {
  error: {
    backgroundColor: bcgov.error,
  } as CSSProperties,
  warning: {
    backgroundColor: bcgov.primaryHighlight,
    color: bcgov.text,
  } as CSSProperties,
  success: {
    backgroundColor: bcgov.success,
  } as CSSProperties,
};

/**
 * @constant
 * @description The context provided by the ErrorWrapper.
 */
export const ErrorContext = createContext(initialContext);

/**
 * @description Wraps the application and provides a popup notification that can be used with the supplied ErrorContext.
 * @param {IErrorWrapper} props Properties passed to the component.
 * @returns A React component
 */
const ErrorWrapper = (props: IErrorWrapper) => {
  const [errorState, setErrorState] = useState(initialState);
  // Value passed into context later
  const value = useMemo(() => ({ errorState, setErrorState }), [errorState]);

  const { children } = props;

  // When the closing X is clicked.
  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorState({
      text: '',
      open: false,
    });
  };

  // The X element in the notification.
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
