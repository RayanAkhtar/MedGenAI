"use client";

import React, { useEffect, useState } from "react";

interface TimerProps {
  onTimeUp: () => void;
  duration?: number;
}

const Timer: React.FC<TimerProps> = ({ onTimeUp, duration = 60 }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  return (
    <div className="text-3xl text-red-500 text-center my-5">{timeLeft}s</div>
  );
};

export default Timer;
