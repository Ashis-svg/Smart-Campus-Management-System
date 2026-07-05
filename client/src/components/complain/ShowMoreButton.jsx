import React from 'react';

const ShowMoreButton = ({ remaining, onClick }) => {
  if (remaining <= 0) return null;

  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition cursor-pointer mb-3"
    >
      Show More ({remaining} remaining)
    </button>
  );
};

export default ShowMoreButton;