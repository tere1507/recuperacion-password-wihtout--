import React, { useState } from 'react';

export const Hello = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
  };

  return (
    <div className="mt-8 p-6 bg-blue-50 rounded-lg shadow-inner">
      <button
        onClick={increment}
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
      >
        Click Me
      </button>
      <p className="mt-4 text-lg text-gray-700">
        You've pressed the button <span className="font-bold text-blue-700">{counter}</span> times.
      </p>
    </div>
  );
};

