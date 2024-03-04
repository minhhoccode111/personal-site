import { AiOutlineLoading } from 'react-icons/ai';

export default function Loading  () {
  return (
    <span className="animate-spin block">
      <AiOutlineLoading className="text-2xl" />
    </span>
  );
};

