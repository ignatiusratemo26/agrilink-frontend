import React from 'react';
import {
  TextField,
  FormHelperText,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  Box,
} from '@mui/material';

/**
 * Reusable Input Field component that supports different input types
 */
const InputField = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  placeholder,
  startAdornment,
  endAdornment,
  options = [],
  size = 'medium',
  multiline = false,
  rows = 1,
  variant = 'outlined',
  sx = {},
  ...props
}) => {
  // For select, radio buttons, checkboxes
  const renderFieldByType = () => {
    switch (type) {
      case 'select':
        return (
          <FormControl fullWidth={fullWidth} error={!!error} variant={variant} size={size} disabled={disabled} sx={sx}>
            <InputLabel id={`${name}-label`} required={required}>{label}</InputLabel>
            <Select
              labelId={`${name}-label`}
              name={name}
              value={value || ''}
              onChange={onChange}
              onBlur={onBlur}
              label={label}
              startAdornment={startAdornment && (
                <InputAdornment position="start">{startAdornment}</InputAdornment>
              )}
              endAdornment={endAdornment && (
                <InputAdornment position="end">{endAdornment}</InputAdornment>
              )}
              {...props}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl error={!!error} disabled={disabled} sx={sx}>
            <FormControlLabel
              control={
                <Checkbox
                  name={name}
                  checked={!!value}
                  onChange={onChange}
                  onBlur={onBlur}
                  color="primary"
                  size={size}
                  {...props}
                />
              }
              label={label}
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case 'switch':
        return (
          <FormControl error={!!error} disabled={disabled} sx={sx}>
            <FormControlLabel
              control={
                <Switch
                  name={name}
                  checked={!!value}
                  onChange={onChange}
                  onBlur={onBlur}
                  color="primary"
                  size={size}
                  {...props}
                />
              }
              label={label}
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl error={!!error} disabled={disabled} sx={sx}>
            <FormLabel component="legend" required={required}>{label}</FormLabel>
            <RadioGroup
              name={name}
              value={value || ''}
              onChange={onChange}
              onBlur={onBlur}
              {...props}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size={size} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      default:
        // text, password, email, number, etc.
        return (
          <TextField
            type={type}
            name={name}
            label={label}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            error={!!error}
            helperText={helperText}
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            placeholder={placeholder}
            size={size}
            multiline={multiline}
            rows={rows}
            variant={variant}
            InputProps={{
              startAdornment: startAdornment && (
                <InputAdornment position="start">{startAdornment}</InputAdornment>
              ),
              endAdornment: endAdornment && (
                <InputAdornment position="end">{endAdornment}</InputAdornment>
              ),
            }}
            sx={sx}
            {...props}
          />
        );
    }
  };

  return renderFieldByType();
};

export default InputField;