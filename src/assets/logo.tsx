
import React from "react";

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="95" fill="#ffffff" stroke="#1e40af" strokeWidth="5" />
    <text
      x="100"
      y="70"
      fontFamily="Arial"
      fontSize="24"
      fontWeight="bold"
      textAnchor="middle"
      fill="#1e40af"
    >
      CENTRO DE FORMAÇÃO
    </text>
    <text
      x="100"
      y="130"
      fontFamily="Arial"
      fontSize="32"
      fontWeight="bold"
      textAnchor="middle"
      fill="#1e40af"
    >
      RHEMA
    </text>
    <text
      x="100"
      y="100"
      fontFamily="Arial"
      fontSize="16"
      textAnchor="middle"
      fill="#1e40af"
    >
      C.F.M
    </text>
    <line x1="100" y1="40" x2="100" y2="160" stroke="#1e40af" strokeWidth="5" />
    <line x1="70" y1="80" x2="130" y2="80" stroke="#1e40af" strokeWidth="3" />
    <text
      x="100"
      y="170"
      fontFamily="Arial"
      fontSize="20"
      fontWeight="bold"
      textAnchor="middle"
      fill="#1e40af"
    >
      E DE MISSÕES
    </text>
  </svg>
);
