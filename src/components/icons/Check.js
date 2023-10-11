import React from "react";

const Check = (props) => {
  const { width = 16, height = 16, color = "var(--secondaryColor)", className } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} feather feather-plus-square`}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};

export default Check;
