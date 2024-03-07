import PropTypes from 'prop-types';

export function SubmitButton({ children, isDisable }) {
  return (
    <button
      disabled={isDisable}
      type="submit"
      className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white transition-all hover:scale-110 hover:shadow hover:shadow-gray-400"
    >
      {children}
    </button>
  );
}

export function CustomButton({ isDisable, children, type = 'button', className = 'bg-link text-white' }) {
  return (
    <button disabled={isDisable} type={type} className={'inline-block rounded-lg px-5 py-3 text-sm font-medium transition-all hover:scale-110 hover:shadow hover:shadow-gray-400 ' + className}>
      {children}
    </button>
  );
}

SubmitButton.propTypes = {
  isDisable: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

CustomButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  isDisable: PropTypes.bool.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
};
