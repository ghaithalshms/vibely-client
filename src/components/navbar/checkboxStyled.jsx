import React, { useEffect, useState } from "react";
import "./checkboxStyle.css";

const Checkbox = ({ isChecked, onChange }) => {
  return (
    <>
      <input
        type="checkbox"
        id="switch"
        checked={isChecked}
        onChange={onChange}
      />
      <label htmlFor="switch">Toggle</label>
    </>
  );
};

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
    <div className="checkbox-toggle-container">
      <Checkbox isChecked={isChecked} onChange={handleToggle} />
    </div>
  );
};

export default CheckboxStyled;
