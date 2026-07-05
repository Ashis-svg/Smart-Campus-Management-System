import React from 'react';

const Toast = ({ toast }) => {
  if (!toast) return null;

  return (
    <>
      <div
        className={`fixed bottom-7 right-7 z-50 px-5 py-3 rounded-xl text-sm font-medium text-white shadow-lg
          animate-[slidein_0.2s_ease] ${toast.ok ? 'bg-[#1e3a5f]' : 'bg-red-500'}`}
      >
        {toast.msg}
      </div>
      <style>{`@keyframes slidein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </>
  );
};

export default Toast;