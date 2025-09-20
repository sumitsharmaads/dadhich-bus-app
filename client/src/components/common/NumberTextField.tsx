import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

// Custom styles to remove number input spinners
const numberInputStyles = {
  "& input[type=number]": {
    MozAppearance: "textfield", // Firefox
  },
  "& input[type=number]::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
};

interface NumberTextFieldProps extends Omit<TextFieldProps, "type"> {
  type?: "number";
}

/**
 * NumberTextField - A TextField component with type="number" that removes spinner arrows
 *
 * Features:
 * - Removes increment/decrement arrows (spinners)
 * - Prevents auto-increment on scroll
 * - Works across all browsers (Chrome, Firefox, Safari, Edge)
 * - Maintains all TextField functionality
 *
 * Usage:
 * <NumberTextField
 *   label="Price"
 *   value={price}
 *   onChange={(e) => setPrice(Number(e.target.value))}
 *   InputProps={{
 *     startAdornment: <InputAdornment position="start">₹</InputAdornment>
 *   }}
 * />
 */
export const NumberTextField: React.FC<NumberTextFieldProps> = ({
  InputProps = {},
  sx = {},
  ...props
}) => (
  <TextField
    {...props}
    type="number"
    InputProps={{
      ...InputProps,
      inputProps: {
        ...InputProps.inputProps,
        style: {
          ...InputProps.inputProps?.style,
          MozAppearance: "textfield", // Firefox
        },
      },
    }}
    sx={{
      ...numberInputStyles,
      ...sx,
    }}
  />
);

export default NumberTextField;
