import { ReactNode, CSSProperties } from 'react';

/**
 * @interface
 * @description The interface describing properties that include children and style components.
 * @property {ReactNode}      children  - Optional: The children elements displayed within the element using this prop.
 * @property {CSSProperties}  sx        - Optional: A style object with styling for the element using this prop.
 */
export interface ChildProps {
  children?: ReactNode,
  sx?: CSSProperties
}
