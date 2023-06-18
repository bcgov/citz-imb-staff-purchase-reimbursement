import { IconButton } from "@mui/material";
import { 
  KeyboardArrowDown,
  KeyboardArrowUp
 } from "@mui/icons-material";
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

/**
 * @interface
 * @description The properties passed to the SortButton
 * @property {string} id The id of the element.
 * @property {SortState} currentValue The current SortState of the element.
 * @property {(e: any) => void} onChange The event handler for the element when clicked.
 */
interface SortButtonProps {
  id: string,
  currentValue: SortState,
  onChange: (e: any) => void
}

/**
 * @interface
 * @description The properties passed to the SortIcon
 * @property {SortState} value The current SortState of the element.
 */
interface SortIconProps {
  value: SortState
}

/**
 * @enum
 * @description The possible states for sorting behaviour
 */
export enum SortState {
  UNSORTED,
  ASCENDING,
  DESCENDING
}

/**
 * @description The icon element within a SortButton.
 * @param {SortIconProps} props Properties passed to the component.
 * @returns {SortIcon} A React component.
 */
const SortIcon = (props: SortIconProps) => {
  const { value } = props;
  switch(value){
    case SortState.DESCENDING:
      return <KeyboardArrowDown />
    case SortState.ASCENDING:
      return <KeyboardArrowUp />
    default:
      return <HorizontalRuleIcon />
  }
}

/**
 * @description The button for sorting toggles.
 * @param {SortButtonProps} props Properties passed to the component.
 * @returns {SortButton} A React component.
 */
const SortButton = (props: SortButtonProps) => {
  const { id, currentValue, onChange } = props;
  return (
    <IconButton id={id} onClick={onChange} aria-description={`Sorts the ${id} field.`}>
      <SortIcon value={currentValue}/>
    </IconButton>
  );
}

export default SortButton;
