"use client"
import React, { useState } from 'react';

interface ToggleElementProps {
  children: React.ReactNode;
  buttonLabel: string;
  toggleAction?: 'onClick' | 'onHover' | 'onDoubleClick' | 'onFocus' | 'onBlur' | 'onContextMenu';
}

const ToggleElement: React.FC<ToggleElementProps> = ({ children, buttonLabel, toggleAction = 'onClick' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility function
  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  // Set visibility to true on hover and false on leave
  const showOnHover = () => setIsVisible(true);
  const hideOnHover = () => setIsVisible(false);

  // Event handlers based on toggleAction
  const eventHandlers = {
    onClick: toggleAction === 'onClick' ? toggleVisibility : undefined,
    onDoubleClick: toggleAction === 'onDoubleClick' ? toggleVisibility : undefined,
    onFocus: toggleAction === 'onFocus' ? toggleVisibility : undefined,
    onBlur: toggleAction === 'onBlur' ? toggleVisibility : undefined,
    onContextMenu: toggleAction === 'onContextMenu' ? (e: React.MouseEvent) => {
      e.preventDefault();
      toggleVisibility();
    } : undefined,
    onMouseEnter: toggleAction === 'onHover' ? showOnHover : undefined,
    onMouseLeave: toggleAction === 'onHover' ? hideOnHover : undefined,
  };

  return (
    <div style={{ textAlign: 'center', margin: '10px' }}>
      {/* Button with dynamically assigned event handler */}
      <button {...eventHandlers} style={buttonStyle}>
        {isVisible ? `Remove ${buttonLabel}` : `Add ${buttonLabel}`}
      </button>

      {/* Conditionally render children */}
      {isVisible && <div style={{ marginTop: '10px' }}>{children}</div>}
    </div>
  );
};

// Common button style for simplicity
const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  margin: '10px',
  cursor: 'pointer',
};

export default ToggleElement;
