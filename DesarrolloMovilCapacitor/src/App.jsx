import React, { useEffect, useState } from 'react';
import { Motion } from '@capacitor/motion';

const App = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Initial ball position (center of the screen)
  const [velocity, setVelocity] = useState({ x: 0, y: 0 }); // Velocity for smooth motion
  const [ballColorIndex, setBallColorIndex] = useState(0); // Index for cycling through colors

  // List of colors to cycle through
  const ballColors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'];

  useEffect(() => {
    // Function to handle accelerometer data
    const startMotion = async () => {
      try {
        // Subscribe to the accelerometer
        Motion.addListener('accel', (event) => {
          const { x, y } = event.accelerationIncludingGravity;

          // Update velocity based on accelerometer data (reduce sensitivity further)
          setVelocity((prev) => ({
            x: prev.x - x * 0.1, // Lower sensitivity
            y: prev.y + y * 0.1, // Invert y-axis for natural movement
          }));
        });
      } catch (error) {
        console.error('Error accessing accelerometer:', error);
      }
    };

    startMotion();

    // Cleanup on unmount
    return () => {
      Motion.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    // Apply damping to simulate "floaty" motion
    const interval = setInterval(() => {
      setPosition((prev) => ({
        x: Math.min(Math.max(prev.x + velocity.x, 0), 100), // Keep within bounds (0 to 100%)
        y: Math.min(Math.max(prev.y + velocity.y, 0), 100),
      }));

      // Reduce velocity over time to simulate friction (increase damping factor further)
      setVelocity((prev) => ({
        x: prev.x * 0.7, // Stronger damping
        y: prev.y * 0.7,
      }));
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [velocity]);

  // Function to change the ball's color
  const changeBallColor = () => {
    setBallColorIndex((prev) => (prev + 1) % ballColors.length); // Cycle through colors
  };

  return (
    <div style={styles.container}>
      {/* Middle Text */}
      <div style={styles.textContainer}>
        <h1 style={styles.title}>Capacitor by Ionic</h1>
        <h2 style={styles.subtitle}>Equipo 2</h2>
      </div>

      {/* Ball */}
      <div
        style={{
          ...styles.ball,
          backgroundColor: ballColors[ballColorIndex], // Set the ball's color
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
    transform: 'translate(-50%, -50%)', // Center the ball
    zIndex: 2, // Ensure the ball is above the text
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
    zIndex: 3, // Ensure the button is above everything else
  },
};

export default App;
