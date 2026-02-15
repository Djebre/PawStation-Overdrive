import { Volume2, VolumeX } from 'lucide-react';

export default function MusicControl({ isMuted, toggleMute, volume, setVolume }) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-deep-purple/80 backdrop-blur-xl border border-white/20 rounded-lg p-3">
        <button
          onClick={toggleMute}
          className="text-cyan-pop hover:text-white transition-colors"
          data-testid="music-mute-toggle"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
        
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume * 100}
          onChange={(e) => setVolume(Number(e.target.value) / 100)}
          className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #01cdfe 0%, #01cdfe ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
          }}
          data-testid="music-volume-slider"
        />
      </div>
    </div>
  );
}
