import React from 'react';
import { Control, Controller, UseFormRegister } from 'react-hook-form';

interface InputProps {
  id: string;
  label: string;
  control: Control<any>;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ id, label, control, required = true }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-medium font-mono text-gray-700 mb-1">
        {label}
      </label>
      <Controller
        name={id}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <input
            {...field}
            id={id}
            className="w-full p-2 border text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        )}
      />
    </div>
  );
};

export default Input;