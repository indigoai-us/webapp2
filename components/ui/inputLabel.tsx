import React from 'react';

type InputLabelProps = {
  label: string;
};

const InputLabel: React.FC<InputLabelProps> = ({ label }) => {
  return <h3 className="text-xs text-slate-300 font-light">{label}</h3>;
};

export default InputLabel;