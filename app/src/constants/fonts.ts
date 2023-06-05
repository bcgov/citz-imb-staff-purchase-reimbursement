import { bcgov } from "./colours"

/**
 * @constant
 * @description Font used for header text.
 */
export const headerFont : React.CSSProperties = {
  lineHeight: '1.25',
  fontFamily: `'BCSans', 'Noto Sans', 'Verdana', 'Arial', 'sans-serif'`,
  color: bcgov.text
}

/**
 * @constant
 * @description Font used for general text.
 */
export const normalFont : React.CSSProperties = {
  fontSize: '16px',
  lineHeight: '1.25',
  fontFamily: `'BCSans', 'Noto Sans', 'Verdana', 'Arial', 'sans-serif'`,
  color: bcgov.text
}
