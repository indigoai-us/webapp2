import React, {useState, useEffect} from 'react';
import Select, { components } from 'react-select';

type SingleSelectProps = {
  options: any[];
  placeholder?: string;
  className?: string;
  initialValue?: any;
  onChange?: (e: any) => void;
};

const { Option } = components;
const IconOption = (props: any) => (
  <Option {...props}>
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      {props.data.icon && 
        <img
          src={props.data.icon}
          style={{ width: 18, marginRight: 10 }}
          alt={props.data.label}
        />    
      }
      <div style={{position: 'relative', top: 1}}>
        {props.data.label}
      </div>
    </div>
  </Option>
);

const SingleValue = ({ ...props }: any) => {
  
  return (
    <components.SingleValue {...props}>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          {props.data.icon && 
            <img
              src={props.data.icon}
              style={{ width: 18, marginRight: 10 }}
              alt={props.data.label}
            />    
          }
          <div style={{position: 'relative', top: 1}}>
            {props.data.label}
          </div>
        </div>
      </div>
    </components.SingleValue>
  )  
};

const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  placeholder = '',
  className,
  initialValue,
  onChange,
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
    singleValue: (styles: any) => ({
        ...styles,
        color: 'rgb(255,255,255)',
    }),
    singleValueLabel: (styles: any) => ({
        ...styles,
        color: 'rgb(255,255,255)',
    }),
    singleValueRemove: (styles: any) => ({
        ...styles,
        color: 'rgb(255,255,255)',
        ':hover': {
        backgroundColor: 'rgb(100,116,139)',
        color: 'rgb(255,255,255)',
        },
    }),
    // Other style definitions are omitted for brevity...
  };

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const selectedOption = options.find((option) => initialValue && option.value.toString() === initialValue.toString());
    initialValue && setValue(selectedOption);
  }, [initialValue, options]);

  const handleChange = (e: any) => {    
    setValue(e);
    onChange && onChange(e);
  };

  return (
    <Select
      options={options}
      className={`my-2 ${className}`}
      styles={customStyles}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      components={{ Option: IconOption, SingleValue }}
    />
  );
};

export default SingleSelect;