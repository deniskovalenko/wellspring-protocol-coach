import React from "react";

interface DonateButtonProps {
  link: string;
}

const DonateButton: React.FC<DonateButtonProps> = ({ link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button
      style={{
        background: "#635bff",
        color: "white",
        padding: "12px 24px",
        border: "none",
        borderRadius: "6px",
        fontSize: "1.1rem",
        cursor: "pointer",
        marginTop: "24px",
        boxShadow: "0 2px 8px rgba(99,91,255,0.15)",
        transition: "background 0.2s",
      }}
      onMouseOver={e => (e.currentTarget.style.background = '#5046e5')}
      onMouseOut={e => (e.currentTarget.style.background = '#635bff')}
    >
      Donate €10
    </button>
  </a>
);

export default DonateButton; 