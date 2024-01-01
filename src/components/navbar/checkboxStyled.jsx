import React, { useEffect, useState } from "react";

const CheckboxStyled = ({
  isDarkMode,
  isCheckedParam,
  isCheckedClick,
  isNotCheckedClick,
}) => {
  const [isChecked, setIsChecked] = useState(isCheckedParam);

  const handleToggle = async () => {
    setIsChecked(!isChecked);
    if (isChecked) isCheckedClick();
    else isNotCheckedClick();
  };

  useEffect(() => {
    setIsChecked(isCheckedParam);
  }, [isCheckedParam]);

  return (
    <div className="checkbox-toggle-container" style={{ marginLeft: "0.5rem" }}>
      <input
        type="checkbox"
        id="switch"
        checked={isChecked}
        onChange={handleToggle}
      />
      <label htmlFor="switch">Toggle</label>
      <style>{`
        .checkbox-toggle-container {
          display: flex;
          align-items: center;
        }

        input[type=checkbox] {
          height: 0;
          width: 0;
          visibility: hidden;
        }

        label {
          cursor: pointer;
          text-indent: -9999px;
          width: 26px;
          height: 16px;
          background: grey;
          display: block;
          border-radius: 8px;
          position: relative;
          margin-right: 5px;
        }

        label:after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          transition: 0.3s;
        }

        input:checked + label {
          background: ${isDarkMode ? "#b00075" : "#333333"};
        }

        input:checked + label:after {
          left: calc(100% - 2px);
          transform: translateX(-100%);
        }

        label:active:after {
          width: 18px;
        }
      `}</style>
    </div>
  );
};

export default CheckboxStyled;
