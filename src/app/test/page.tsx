// src/pages/index.tsx
import React from 'react';
import ToggleElement from '@/app/components/toggleElement';
import InputField from '@/app/components/inputField';

const HomePage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Customizable Toggle Elements Demo</h1>

      {/* Toggle InputField with Click */}
      <ToggleElement buttonLabel="Input Field" toggleAction="onClick">
        <InputField label="Username" />
      </ToggleElement>

      {/* Toggle h4 Heading with Hover */}
      <ToggleElement buttonLabel="Heading" toggleAction="onHover">
        <h4 style={{ color: 'blue' }}>This is a dynamically added heading</h4>
      </ToggleElement>

      {/* Toggle Div with text using Double Click */}
      <ToggleElement buttonLabel="Div" toggleAction='onContextMenu' >
        <div style={{ padding: '10px', backgroundColor: 'lightgray' }}>
          This is a dynamically added div with some content.
        </div>
      </ToggleElement>
    </div>
  );
};

// Optional styling for the action button
const actionButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  margin: '10px',
  cursor: 'pointer',
};

export default HomePage;
