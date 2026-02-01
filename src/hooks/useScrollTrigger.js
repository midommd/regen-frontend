import { useState, useEffect } from 'react';

export const useScrollTrigger = (threshold = 50) => {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setTriggered(true);
      } else {
        setTriggered(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return triggered;
};