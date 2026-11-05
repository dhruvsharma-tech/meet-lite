import { useState, useMemo, useEffect, useRef } from 'react';
import { useTracks, useSpeakingParticipants } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoTile from './VideoTile';

// Maximum participants shown per page
const MAX_TILES_PER_PAGE = 8;

export default function ParticipantGrid() {
  const [currentPage, setCurrentPage] = useState(0);

  // Track both Camera and Placeholder tracks
  const allTracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);

  // Keep a map of when participants last spoke for speaking recency priority
  const speakingParticipants = useSpeakingParticipants();
  const lastSpokeRef = useRef(new Map());

  useEffect(() => {
    const now = Date.now();
    speakingParticipants.forEach((p) => {
      lastSpokeRef.current.set(p.identity, now);
    });
  }, [speakingParticipants]);

  // Deduplicate tracks by participant identity
  const allItems = useMemo(() => {
    const seen = new Set();
    const unique = [];
    for (const item of allTracks) {
      const id = item.participant?.identity || item.publication?.trackSid;
      if (id && !seen.has(id)) {
        seen.add(id);
        unique.push(item);
      }
    }
    return unique;
  }, [allTracks]);

  // Sort participants by priority:
  const sortedItems = useMemo(() => {
    const now = Date.now();
    const currentlySpeakingSet = new Set(speakingParticipants.map((p) => p.identity));

    return [...allItems].sort((a, b) => {
      const aId = a.participant?.identity || '';
      const bId = b.participant?.identity || '';

      // 1. Current speaker priority
      const aSpeakingNow = currentlySpeakingSet.has(aId) ? 1 : 0;
      const bSpeakingNow = currentlySpeakingSet.has(bId) ? 1 : 0;
      if (aSpeakingNow !== bSpeakingNow) {
        return bSpeakingNow - aSpeakingNow;
      }

      // 2. Recent speaker priority (within last 15 seconds)
      const aRecentSpoke = lastSpokeRef.current.get(aId) || 0;
      const bRecentSpoke = lastSpokeRef.current.get(bId) || 0;
      const aIsRecent = now - aRecentSpoke < 15000;
      const bIsRecent = now - bRecentSpoke < 15000;
      if (aIsRecent !== bIsRecent) {
        return bIsRecent ? 1 : -1;
      }

      // 3. Camera ON priority
      const aHasVideo = (a.publication?.track && !a.publication?.isMuted && a.participant?.isCameraEnabled) ? 1 : 0;
      const bHasVideo = (b.publication?.track && !b.publication?.isMuted && b.participant?.isCameraEnabled) ? 1 : 0;
      if (aHasVideo !== bHasVideo) {
        return bHasVideo - aHasVideo;
      }

      // 4. Stable alphabetical fallback
      return aId.localeCompare(bId);
    });
  }, [allItems, speakingParticipants]);

  // Pagination calculation
  const totalItems = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / MAX_TILES_PER_PAGE));

  // Reset page if it exceeds total pages when users leave
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [currentPage, totalPages]);

  // Only the visible page slice is rendered in the DOM
  const visibleItems = useMemo(() => {
    const start = currentPage * MAX_TILES_PER_PAGE;
    return sortedItems.slice(start, start + MAX_TILES_PER_PAGE);
  }, [sortedItems, currentPage]);

  const count = visibleItems.length;

  // Responsive grid layout classes: mobile portrait vs landscape vs desktop
  let gridClass = 'grid-cols-1 max-w-2xl'; // 1 user
  if (count === 2) {
    gridClass = 'grid-cols-1 sm:grid-cols-2 max-w-4xl';
  } else if (count >= 3 && count <= 4) {
    gridClass = 'grid-cols-2 max-w-5xl';
  } else if (count >= 5 && count <= 6) {
    gridClass = 'grid-cols-2 lg:grid-cols-3 max-w-6xl';
  } else if (count >= 7) {
    gridClass = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl';
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-2 sm:p-3 relative overflow-hidden select-none">
      {/* Active Grid Viewport */}
      <div className="flex-1 w-full h-full flex items-center justify-center overflow-y-auto min-h-0">
        <div className={`grid ${gridClass} gap-2 sm:gap-3 w-full h-full max-h-full justify-center auto-rows-fr`}>
          {visibleItems.map((item, idx) => {
            const participant = item.participant;
            const key = participant?.identity || item.publication?.trackSid || idx;
            return (
              <div key={key} className="w-full h-full min-h-0 flex items-center justify-center">
                <VideoTile trackRef={item} participant={participant} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="shrink-0 pt-2 pb-1 flex items-center justify-center gap-3 z-10">
          <div className="flex items-center gap-2 bg-[#1e1f22]/90 backdrop-blur-md border border-[#2b2d31] rounded-full px-3 py-1 shadow-lg">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className={`p-1 rounded-full transition-colors cursor-pointer ${
                currentPage === 0
                  ? 'text-[#80848e]/40 cursor-not-allowed'
                  : 'text-white hover:bg-[#35373c]'
              }`}
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-[#b5bac1]">
              <span>Page {currentPage + 1} of {totalPages}</span>
              <span className="text-[#80848e] ml-1">({totalItems} total)</span>
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className={`p-1 rounded-full transition-colors cursor-pointer ${
                currentPage >= totalPages - 1
                  ? 'text-[#80848e]/40 cursor-not-allowed'
                  : 'text-white hover:bg-[#35373c]'
              }`}
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
