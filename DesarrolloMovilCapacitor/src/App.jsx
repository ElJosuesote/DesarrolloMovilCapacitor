import React, { useEffect, useState } from 'react';
import { Motion } from '@capacitor/motion';

const App = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [ballColorIndex, setBallColorIndex] = useState(0);

  const ballColors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'];

  useEffect(() => {
    const startMotion = async () => {
      try {
        Motion.addListener('accel', (event) => {
          const { x, y } = event.accelerationIncludingGravity;
          setVelocity((prev) => ({
            x: prev.x - x * 0.1,
            y: prev.y + y * 0.1,
          }));
        });
      } catch (error) {
        console.error('Error accessing accelerometer:', error);
      }
    };

    startMotion();

    return () => {
      Motion.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => ({
        x: Math.min(Math.max(prev.x + velocity.x, 0), 100),
        y: Math.min(Math.max(prev.y + velocity.y, 0), 100),
      }));

      setVelocity((prev) => ({
        x: prev.x * 0.7,
        y: prev.y * 0.7,
      }));
    }, 16); 

    return () => clearInterval(interval);
  }, [velocity]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;

      const xPercent = (clientX / window.innerWidth) * 100;
      const yPercent = (clientY / window.innerHeight) * 100;

      setPosition({ x: xPercent, y: yPercent });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const changeBallColor = () => {
    setBallColorIndex((prev) => (prev + 1) % ballColors.length);
  };

  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <h1 style={styles.title}>Capacitor by Ionic</h1>
        <h2 style={styles.subtitle}>Equipo 2</h2>
      </div>

      <div
        style={{
          ...styles.ball,
          backgroundColor: ballColors[ballColorIndex],
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
      />

      {/* Button */}
      <button style={styles.button} onClick={changeBallColor}>
        Cambiar color
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  textContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
    margin: 0,
  },
  ball: {
    position: 'absolute',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
  },
  button: {
    position: 'absolute',
    bottom: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    zIndex: 3, 
  },
};

export default App;
