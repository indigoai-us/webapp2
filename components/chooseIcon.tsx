import React, {useEffect, useState} from 'react';
import Icon from '@/components/ui/icon';

const iconSet = [
  'Home', 'Car', 'Cat', 'Dog', 'DollarSign', 'Axe', 'Book', 'Bird'
]

const ChooseIcon = ({setSelectedIcon, initialIcon}: any) => {
  const [selected, setSelected] = useState<any>(initialIcon);

  useEffect(() => {
    setSelected(initialIcon);
  }, [initialIcon]);

  const handleSelected = (icon: any) => {
    setSelected(icon);
    setSelectedIcon(icon);
  }

  return (
    <div className="mt-[25px] flex justify-start">
      {iconSet.map((icon: any, i: number) => {
        return (
          <div key={i} className={`mr-2 cursor-pointer hover:text-yellow-700 ${selected === icon ? 'text-orange-700' : 'text-white-700'}`}>
            <Icon name={icon} onClick={() => handleSelected(icon)}/>
          </div>
        )
      })}
    </div>
  );
}
export default ChooseIcon;