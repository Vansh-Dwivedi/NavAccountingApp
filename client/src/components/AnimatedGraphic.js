import React from 'react';

const AnimatedGraphic = () => (
  <>
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }} />
      <img 
        src={process.env.REACT_APP_API_URL + "/uploads/graphic-bg.svg"}
        alt="Background Graphic"
        style={{ 
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </div>
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '700px',
      height: '700px',
      zIndex: 0,
      pointerEvents: 'none',
      marginTop: '0px',
      marginRight: '-100px'
    }}>
      <img 
        src={process.env.REACT_APP_API_URL + "/uploads/ani.svg"} 
        alt="Animated Graphic" 
        className="rotating-svg" 
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  </>
);

export default AnimatedGraphic;
