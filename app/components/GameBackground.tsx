import React from "react";

const GameBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-5">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25px 25px, black 2%, transparent 0%), radial-gradient(circle at 75px 75px, black 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      ></div>
    </div>
  );
};

export default GameBackground;
