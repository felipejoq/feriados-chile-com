import type { ReactNode, ChangeEvent, SelectHTMLAttributes } from "react";

type Option = {
  value: string;
  label: string;
};

type SelectInputProps = {
  id: string;
  name: string;
  value: string;
  label: string; // etiqueta accesible
  options: Option[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  icon?: ReactNode; // ícono decorativo opcional (ej: <GoCalendar />)
  placeholder?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const SelectInput = ({
  id,
  name,
  value,
  label,
  options,
  onChange,
  icon,
  placeholder = "Selecciona una opción",
  ...props
}: SelectInputProps) => {
  return (
    <div className="flex flex-col flex-1 min-w-3xs relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <div className="relative w-full">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}

        {/* Flecha personalizada */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
          <svg
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 8l4 4 4-4" />
          </svg>
        </div>

        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full p-2 ${
            icon ? "pl-10" : "pl-3"
          } pr-10 border border-gray-300 rounded-xl bg-white text-gray-900 appearance-none`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
