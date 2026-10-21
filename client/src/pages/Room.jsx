import { useParams } from 'react-router-dom';

export default function Room() {
  const { roomId } = useParams();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Room: {roomId}</h1>
        <p className="text-sm text-gray-500 mt-2">Connecting to room...</p>
      </div>
    </div>
  );
}
