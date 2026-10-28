import { Track } from 'livekit-client';
import { useTracks, useParticipants } from '@livekit/components-react';
import VideoTile from './VideoTile';

export default function ParticipantGrid() {
  const participants = useParticipants();
  const cameraTracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);

  // Combine tracks or participants
  const items = cameraTracks.length > 0 ? cameraTracks : participants.map((p) => ({ participant: p }));
  const count = items.length;

  let gridClass = 'grid-cols-1 max-w-2xl'; // 1 user: large centered
  if (count === 2) {
    gridClass = 'grid-cols-1 md:grid-cols-2 max-w-4xl';
  } else if (count >= 3 && count <= 4) {
    gridClass = 'grid-cols-2 max-w-5xl';
  } else if (count > 4) {
    gridClass = 'grid-cols-2 lg:grid-cols-3 max-w-6xl';
  }

  return (
    <div className="flex-1 w-full h-full flex items-center justify-center p-4 overflow-y-auto">
      <div className={`grid ${gridClass} gap-3 w-full h-full max-h-[85vh] justify-center auto-rows-fr`}>
        {items.map((item, idx) => {
          const participant = item.participant;
          const key = item.publication?.trackSid || participant?.identity || idx;
          return (
            <div key={key} className="w-full h-full min-h-[180px] flex">
              <VideoTile trackRef={item.publication ? item : null} participant={participant} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
