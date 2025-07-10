import React from "react";

const ResetIcon = ({ size = 48, color = "#00fff0", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="3" fill="none" />
    <path d="M36 24c0-6.627-5.373-12-12-12" />
    <polyline points="36,16 36,24 28,24" />
  </svg>
);

export default ResetIcon;
