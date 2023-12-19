import React from 'react';
import Select from 'react-select';

type MultiSelectProps = {
  options: any[];
  placeholder?: string;
  className?: string;
  value: any[];
  onChange?: (e: any) => void;
};

const ControlledMultiSelect: React.FC<MultiSelectProps> = ({
  options,
  placeholder = '',
  className,
  onChange,
  value
}) => {
  const customStyles = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: 'rgb(24,24,27)',
      borderColor: 'rgb(39,39,42)',
      borderWidth: 1,
      borderRadius: 4,
      outline: 'none',
      color: '#D0D0D0',
      fontSize: 13,
    }),
    placeholder: (styles: any) => ({
        ...styles,
        color: 'rgb(113,113,122)',
    }),
    menu: (styles: any) => ({
        ...styles,
        backgroundColor: 'rgb(39,39,42)',
        fontSize: 14,
    }),
    indicatorSeparator: (styles: any) => ({
        ...styles,
        backgroundColor: 'transparent',
        display: 'none',
    }),
    option: (styles: any, { isFocused, isSelected }: any) => {
        return {
        ...styles,
        backgroundColor: isSelected
            ? 'rgb(39,39,42)'
            : isFocused
            ? 'rgb(55,48,163)'
            : null,
        };
    },
    multiValue: (styles: any) => ({
        ...styles,
        backgroundColor: 'rgb(39,39,42)',
        color: 'rgb(255,255,255)',
    }),
    multiValueLabel: (styles: any) => ({
        ...styles,
        fontSize: 14,
        color: 'rgb(255,255,255)',
    }),
    multiValueRemove: (styles: any) => ({
        ...styles,
        color: 'rgb(255,255,255)',
        ':hover': {
        backgroundColor: 'rgb(100,116,139)',
        color: 'rgb(255,255,255)',
        },
    }),
    // Other style definitions are omitted for brevity...
  };

  return (
    <Select
      options={options}
      isMulti
      className={`my-2 ${className}`}
      styles={customStyles}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

export default ControlledMultiSelect;