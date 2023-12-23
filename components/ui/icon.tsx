// @ts-ignore
import { icons } from 'lucide-react';

type MainIconProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  color?: string;
  size?: number;
  onClick?: () => void;
};

const Icon: React.FC<MainIconProps> = ({ name, color, size, onClick }) => {
  const LucideIcon = icons[name as keyof typeof icons];

  return <LucideIcon color={color} size={size} onClick={onClick} />;
};

export default Icon;