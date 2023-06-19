import { bcgov } from './colours';
import { CSSProperties } from 'react';

/**
 * @constant
 * @description Font used for header text.
 */
export const headerFont: CSSProperties = {
  lineHeight: '1.25',
  fontFamily: `'BCSans', 'Noto Sans', 'Verdana', 'Arial', 'sans-serif'`,
  color: bcgov.text,
};

/**
 * @constant
 * @description Font used for general text.
 */
export const normalFont: CSSProperties = {
  fontSize: '16px',
  lineHeight: '1.25',
  fontFamily: `'BCSans', 'Noto Sans', 'Verdana', 'Arial', 'sans-serif'`,
  color: bcgov.text,
};
