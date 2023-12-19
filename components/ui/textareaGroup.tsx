import React, { useEffect, useState } from "react";
import InputLabel from "@/components/ui/inputLabel";
import Textarea from "@/components/ui/textarea";

interface TextareaGroupProps {
  labelText: string;
  textareaPlaceholder: string;
  initialValue?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextareaGroup: React.FC<TextareaGroupProps> = ({
  labelText,
  textareaPlaceholder,
  onChange,
  initialValue,
  required
}) => {

  return (
    <>
      <InputLabel label={labelText} />
      <Textarea
        className="bg-zinc-900 h-auto mt-2 mb-4 outline-none border-solid border-zinc-800 border rounded-md w-full  text-white text-sm font-light p-2 block focus:ring-transparent focus:border-indigo-600 hover:border-zinc-600 transition-all"
        placeholder={textareaPlaceholder}
        onChange={onChange}
        initialValue={initialValue}
        required={required}
      ></Textarea>
    </>
  );
};

export default TextareaGroup;