import React, { TextareaHTMLAttributes, useEffect, useState } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  initialValue?: string;
}

const Textarea: React.FC<TextareaProps> = ({ placeholder = 'You are an [xxx] assistant...', onChange, initialValue, ...props }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  },[initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange && onChange(e);
  }

  return (
    <textarea 
      rows={2}
      className="bg-zinc-900 h-auto mt-2 mb-4 outline-none border-solid border-zinc-800 border rounded-md w-full bg-zinc-900 text-white text-sm font-light p-4 block focus:ring-transparent focus:border-indigo-600 hover:border-zinc-600 transition-all"
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
      {...props}
    ></textarea>
  );
};

export default Textarea;