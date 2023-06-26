import React, { useEffect } from 'react'

type NotificationProps = {
    notify: {
      state: boolean;
      color: string;
      message: string;
    };
    setNotify: (value: any) => void;
    duration: number;
};

export default function notification({ notify, setNotify, duration} : NotificationProps) {
    useEffect(() => {
        if(notify.state) {
            const timeout = setTimeout(() =>{
                setNotify({state:false, color:'', message:''})
            },duration)
            return () => {
                clearTimeout(timeout);
            };
        }
    },[notify, setNotify])

    const style = {
        backgroundColor: 'bg-' + notify.color + '-100',
        borderColor: 'border-' + notify.color + '-400',
        color: 'text-' + notify.color + '-700',
    };

    return (
        <div className={`transition-all transform duration-500 ease-out ${!notify.state ? 'opacity-0 delay-1000 top-10 border-0 ' : 'opacity-100 top-24'} 
            ${style.backgroundColor} ${style.color} ${style.borderColor}
            px-4 py-3 rounded fixed top-10 -translate-y-1/2 z-[99]`} 
            role="alert">
            <span className="block sm:inline">{notify.message}</span>
        </div>
    )
}
