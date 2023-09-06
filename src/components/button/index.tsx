import React from 'react'

export const Button = (props: {
    label: string;
    onClick(): any;
    disabled?: boolean;
}) => {
    const {disabled = false} = props;
  return (
    <div className="self-center">
        <button disabled={disabled} onClick={props.onClick} className=" bg-emerald-900 text-white font-semibold py-[6px] px-6 border rounded-full disabled:opacity-50">
            {props.label}
        </button>
    </div>
  )
}
