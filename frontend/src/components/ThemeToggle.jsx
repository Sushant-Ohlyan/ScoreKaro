import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import '../style/ThemeToggle.css'; 

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="theme-toggle" onClick={() => setDark(!dark)}>
      {dark ? <FaSun /> : <FaMoon />}
    </div>
  );
};

export default ThemeToggle;
