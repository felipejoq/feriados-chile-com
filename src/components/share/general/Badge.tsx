import type {JSX} from "react";

interface Props {
  icon?: JSX.Element;
  className?: string;
  label: string;
};

export const Badge = ({ icon, label, className = ''}: Props) => {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-900 ${className}`}>
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </span>
  );
};
