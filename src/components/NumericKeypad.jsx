import React from 'react';

const NumericKeypad = ({ onDigit, onDelete, onSubmit }) => {
  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '⌫', '0', '⏎'
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {buttons.map((btn, i) => (
        <button
          key={i}
          className="bg-gray-200 rounded p-4 text-2xl"
          onClick={() => {
            if (btn === '⌫') onDelete();
            else if (btn === '⏎') onSubmit();
            else onDigit(btn);
          }}
        >
          {btn}
        </button>
      ))}
    </div>
  );
};

export default NumericKeypad;
