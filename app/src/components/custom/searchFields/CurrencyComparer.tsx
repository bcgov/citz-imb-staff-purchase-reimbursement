import { Button, ButtonGroup, TextField, InputAdornment } from "@mui/material";
import { buttonStyles } from "../../bcgov/ButtonStyles";
import React from "react";
import { bcgov } from "../../../constants/colours";

/**
 * @description Defines the properties for the Currency Comparer component.
 * @interface
 * @property {React.CSSProperties}  sx              Style properties for the component.
 * @property {string}               value           The number value as a string.
 * @property {(e: any) => void}     changeSymbol    Updates the symbol used in the filter's comparison.
 * @property {(e: any) => void}     onChange        Function called when value of the component changes.
 */
interface CurrencyComparerProps {
  sx: React.CSSProperties,
  value: string,
  changeSymbol: (e: any) => void,
  onChange: (e: any) => void,
}

/**
 * @enum
 * @description Enum to define possible comparison symbol states.
 */
export enum Symbols {
  GT, // Greater than
  LT // Less than
}

/**
 * @description Component that takes a value and compares it against a stored symbol. Uses a clickable button and text field combo.
 * @param {CurrencyComparerProps} props Properties passed to CurrencyComparer component.
 * @returns A React component.
 */
const CurrencyComparer = (props: CurrencyComparerProps) => {
  const { sx, value, changeSymbol, onChange } = props;

  return (
  <>
    <ButtonGroup
      sx={{
        ...sx
      }}
    >
      <Button
        sx={{
          ...buttonStyles.secondary,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderColor: 'lightgray',
          padding: 0,
          height: '2.2em'
        }}
        aria-label='Change cost filter direction'
        aria-description='Changes the filter to look for greater or equal to versus less or equal to the value.'
        onClick={changeSymbol}
      ><div id='symbol' style={{ color: bcgov.component }}>{'>='}</div></Button>
      <TextField 
        variant='standard'
        id='costInput'
        value={value}
        name='costFilterInput'
        aria-label='Cost Filter Input'
        onChange={(e) => {
          const regex = /^[0-9\.]*$/; // Any combo of numbers and decimals.
          if (regex.test(e.target.value)){
            onChange(e);
          }
        }}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          sx: {
            color: bcgov.text
          }
        }}
        sx={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          height: '2em',
          width: '5em',
          paddingLeft: '0.25em'
        }}
      />
    </ButtonGroup>
  </>);
}

export default CurrencyComparer;
