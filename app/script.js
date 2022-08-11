import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { useState, useMemo } from 'react';
import { app } from 'electron';

const App = () => {

  const [status, setStatus] = useState('off');
  const [time, setTime] = useState(null);
  const [timer, setTimer] = useState(null);
  const sound = new Audio('./sounds/bell.wav');

  const formatTime = (props) => {
    let allSeconds = props;
    let hours = Math.floor(allSeconds / 3600);
    let minutes = Math.floor((allSeconds - (hours * 3600)) / 60);
    let seconds = Math.floor((allSeconds - (hours * 3600) - (minutes * 60)) / 1);
    
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }

    return ( minutes + ':' + seconds )
  }

  const displayTime = useMemo(()=> formatTime(time),  [time]);

  const handleStart = () => {
    setStatus('work');
    setTime(1200);
    startTimer();
  };

  const handleStop = () => {
    setStatus('off');
    setTime(null);
    clearInterval(timer);
  }
  const handelClose = () => {
    window.close();
  };

  const startTimer = () => {
    setTimer ( setInterval(() => {setTime(time => time - 1)}, 1000 ))
  };

  useEffect(() => {
    if(time === 0 && status === 'work'){
      clearInterval(timer);
      sound.play();
      setStatus('rest');
      setTime(20);
      startTimer();
    } else if (time === 0 && status === 'rest'){
      clearInterval(timer);
      sound.play();
      setStatus('work');
      setTime(1200);
      startTimer(time);
    } else if (status === 'off'){
      clearInterval(timer);

    }

  },[time]);

  return (
    <div>
      <h1>Protect your eyes</h1>
      { status === 'off' && (
      <div>
        <p>According to optometrists in order to save your eyes, you should follow the 20/20/20. It means you should to rest your eyes every 20 minutes for 20 seconds by looking more than 20 feet away.</p>
        <p>This app will help you track your time and inform you when it's time to rest.</p>
      </div> 
      )}
      { status === 'work' && (<img src="./images/work.png" /> )}
      { status === 'rest' && (<img src="./images/rest.png" /> )}
      { status !== 'off' && (<div className="timer"> 
        {displayTime}
        </div> )}
      { status === 'off' && (<button onClick={handleStart} className="btn">Start</button> )}
      { status !== 'off' && (<button onClick={handleStop} className="btn">Stop</button> )}
      <button onClick={handelClose} className="btn btn-close">X</button>
    </div>
  )
};

render(<App />, document.querySelector('#app'));
