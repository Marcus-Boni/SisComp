import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

export const ControlledInput = ({ control, name, ...inputProps }) => {
  return (
    <div className="flex flex-col">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <input {...inputProps} value={value ?? ''} onChange={onChange} />
          </>
        )}
      />
    </div>
  );
};

ControlledInput.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired
};
