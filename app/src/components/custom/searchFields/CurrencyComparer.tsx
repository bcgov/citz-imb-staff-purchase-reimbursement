import { Button, ButtonGroup, TextField, InputAdornment } from "@mui/material";
import { buttonStyles } from "../../bcgov/ButtonStyles";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import './CurrencyComparer.css';
import styled from "@emotion/styled";

interface CurrencyComparerProps {
  sx: React.CSSProperties,
  value: string,
  changeSymbol: (e: any) => void,
  onChange: (e: any) => void,

}

export enum Symbols {
  GT, // Greater than
  LT // Less than
}

// const Input = styled(TextField)(({ theme }) => ({
//   "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
//     display: "none",
//   },
//   "& input[type=number]": {
//     MozAppearance: "textfield",
//   },
// }));

const CurrencyComparer = (props: CurrencyComparerProps) => {
  const { sx, value, changeSymbol, onChange } = props;
  //const [value, setValue] = useState<string>('');


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
          padding: 0,
          height: '2.2em'
        }}
        onClick={changeSymbol}
      ><div id='symbol'>{'>='}</div></Button>
      <TextField 
        variant='standard'
        id='costInput'
        value={value}
        onChange={(e) => {
          const regex = /^[0-9\.]*$/;
          if (regex.test(e.target.value)){
            //setValue(e.target.value);
            onChange(e);
          }
        }}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>
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
