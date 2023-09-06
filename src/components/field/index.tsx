import React from 'react'

export const TextField = (props: {
    label: string;
    value: string;
    onChange(v: any): any;
    password?: boolean;
}) => {
  return (
    <div className="flex flex-col">
        <div className="">
            <label className=" text-emerald-950 font-light mb-1">
                {props.label}
            </label>
        </div>
        <div className=" w-80">
            <input
                className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-emerald-900"
                value={props.value}
                onChange={(e)=>props.onChange(e.target.value)}
                type={props?.password ? "password" : "text"}
            />
        </div>
    </div>
  )
}
