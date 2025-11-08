import React from 'react';
import './App.css';
import Main from './components/mainComponent';
import { useTheme } from './hooks/useTheme';

function App() {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="App">
      <Main theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
