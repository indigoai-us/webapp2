import React, { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';

interface MainSliderProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MainSlider: React.FC<MainSliderProps> = ({ min = 0.0, max = 1.0, step = 0.01, initialValue, onChange }) => {
  const [value, setValue] = useState<any>(min + (max - min) / 2);

  useEffect(() => {
    console.log('main slider initial value', initialValue);
    
    initialValue && setValue(initialValue);
  }, [initialValue])

  const handleChange = (values: any) => {
    setValue(values[0]);
    onChange && onChange(values[0]);
  };

  // Determine the number of decimal places to display based on the step value
  const decimalPlaces = step < 1 ? step.toString().split('.')[1].length : 0;

  return (
    // <form>
      <div className="flex items-center w-full mt-2">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[value]}
          max={max}
          min={min}
          step={step}
          aria-label="Temperature"
          onValueChange={handleChange}
        >
          <Slider.Track className="bg-blackA10 relative grow rounded-full h-[3px] bg-zinc-700">
            <Slider.Range className="absolute bg-zinc-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-white rounded-[10px] hover:bg-violet3 " />
        </Slider.Root>
        <span className="ml-2 text-xs text-zinc-300 w-8">{value.toFixed(decimalPlaces)}</span>
      </div>
    // </form>
  );
};

export default MainSlider;