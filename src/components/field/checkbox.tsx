import React from 'react'

export const Checkbox = (props: {
    label: string;
    checked: boolean;
    onClick(v: any): any;
}) => {
  return (
    <div className="flex items-center">
        <input onChange={()=> props.onClick(!props.checked)} checked={props.checked} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
        <label className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">{props.label}</label>
    </div>
  )
}
