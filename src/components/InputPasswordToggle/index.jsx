/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputPasswordToggle = ({ id, disabled, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-3">
      <div className="input-group">
        <input
          type={showPassword ? 'text' : 'password'}
          className="form-control"
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled === 'N' ? true : false}
          placeholder={placeholder}
          required
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={handleTogglePassword}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>
    </div>
  );
};

export default InputPasswordToggle;
