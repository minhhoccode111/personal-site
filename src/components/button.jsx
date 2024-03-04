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

SubmitButton.propTypes = {
  isDisable: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
