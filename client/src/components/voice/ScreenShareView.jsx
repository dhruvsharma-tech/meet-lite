import { Track } from 'livekit-client';
import { useTracks, VideoTrack, useParticipants } from '@livekit/components-react';
import VideoTile from './VideoTile';

export default function ScreenShareView({ screenShareTrack }) {
  const participants = useParticipants();
  const cameraTracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);

  const items = cameraTracks.length > 0 ? cameraTracks : participants.map((p) => ({ participant: p }));

  const sharerName = screenShareTrack?.participant?.name || screenShareTrack?.participant?.identity || 'Someone';

  return (
    <div className="flex-1 w-full h-full flex flex-col md:flex-row gap-3 p-4 overflow-hidden">
      {/* Dominant Screen Share Viewport */}
      <div className="flex-1 min-w-0 bg-black rounded-xl overflow-hidden relative flex items-center justify-center border border-[#2b2d31]">
        {screenShareTrack ? (
          <VideoTrack
            trackRef={screenShareTrack}
            className="w-full h-full object-contain max-h-[82vh]"
          />
        ) : (
          <div className="text-sm text-[#80848e]">No screen share active</div>
        )}

        <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-md text-xs font-medium text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#23a55a] animate-pulse" />
          <span>{sharerName}'s screen</span>
        </div>
      </div>

      {/* Participant Strip (right sidebar or bottom row) */}
      <div className="w-full md:w-60 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0 max-h-[200px] md:max-h-full">
        {items.map((item, idx) => {
          const participant = item.participant;
          const key = item.publication?.trackSid || participant?.identity || idx;
          return (
            <div key={key} className="w-40 md:w-full h-28 shrink-0">
              <VideoTile trackRef={item.publication ? item : null} participant={participant} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

