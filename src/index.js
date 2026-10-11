import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Register from './components/registerform/register';
import Todomenu from './components/Todomenu/todomenu';
import './fullscreenbutton.css';

function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [error, setError] = useState('');

  useEffect(() => {
    function syncFullscreenState() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener('fullscreenchange', syncFullscreenState);
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState);
  }, []);

  async function toggleFullscreen() {
    setError('');

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        setError('Fullscreen mode is not supported by this browser.');
      }
    } catch {
      setError('Could not change fullscreen mode. Check your browser permissions.');
    }
  }

  return (
    <div className="fullscreen-control">
      <button type="button" onClick={toggleFullscreen}>
        {isFullscreen ? 'Exit full screen' : 'Full screen'}
      </button>
      {error && <span role="alert">{error}</span>}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <>
      <Register TodoMenu={Todomenu} />
      <FullscreenButton />
    </>
  </React.StrictMode>
);