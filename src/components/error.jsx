import { RiSignalWifiErrorFill } from 'react-icons/ri';

export default function Error({ className = 'text-2xl' }) {
  return (
    <span className={className}>
      <RiSignalWifiErrorFill className="" />
    </span>
  );
}
