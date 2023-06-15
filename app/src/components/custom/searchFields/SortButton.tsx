import { Button, IconButton } from "@mui/material";
import { 
  KeyboardArrowDown,
  KeyboardArrowUp
 } from "@mui/icons-material";
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

interface SortButtonProps {
  id: string,
  currentValue: SortState,
  onChange: (e: any) => void
}

interface SortIconProps {
  value: SortState
}

export enum SortState {
  UNSORTED,
  ASCENDING,
  DESCENDING
}

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

const SortButton = (props: SortButtonProps) => {
  const { id, currentValue, onChange } = props;
  return (
    <IconButton id={id} onClick={onChange}>
      <SortIcon value={currentValue}/>
    </IconButton>
  );
}

export default SortButton;
