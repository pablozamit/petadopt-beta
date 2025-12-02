import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors ml-2"
        aria-label="Más información"
      >
        <Icon name="Info" size={14} />
      </button>

      {isVisible && (
        <div className="absolute z-50 w-64 p-3 mt-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg left-0 top-full">
          <div className="relative">
            {content}
            <div className="absolute w-3 h-3 bg-gray-900 transform rotate-45 -top-4 left-4"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;