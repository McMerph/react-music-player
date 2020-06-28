import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import isValidPositiveInt from '../utils/is-valid-positive-int';

const MIN = 1;
// TODO Make it adjustable? Store in localStorage?
const MAX = 999;

const getView = (loopNumber) => ({
  value: loopNumber.toString(10),
  valid: isValidPositiveInt(loopNumber, { min: MIN, max: MAX }),
});

const LoopInput = ({ label, loopNumber, setLoopNumber, className }) => {
  const [view, setView] = useState(getView(loopNumber));
  useEffect(() => {
    setView(getView(loopNumber));
  }, [loopNumber, getView]);

  return (
    <TextField
      className={className}
      type="number"
      min={MIN}
      max={MAX}
      step={1}
      label={label}
      error={!view.valid}
      helperText={view.valid ? null : `[${MIN}, ${MAX}]`}
      value={view.value}
      onChange={(event) => {
        const { value } = event.target;
        const onlyZeros = /^0+$/.test(value);
        if (onlyZeros) {
          setView({ value, valid: false });
        } else {
          const normalizedValue = value.replace(/^0+/, '');
          const valid = isValidPositiveInt(normalizedValue, {
            min: MIN,
            max: MAX,
          });
          if (valid) {
            setLoopNumber(Number.parseInt(normalizedValue, 10));
          }
          setView({ value: normalizedValue, valid });
        }
      }}
    />
  );
};

LoopInput.propTypes = {
  label: PropTypes.string.isRequired,
  loopNumber: PropTypes.number.isRequired,
  setLoopNumber: PropTypes.func.isRequired,
  className: PropTypes.string,
};
LoopInput.defaultProps = {
  className: null,
};

export default LoopInput;
