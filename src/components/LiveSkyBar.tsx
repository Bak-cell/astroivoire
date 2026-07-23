import { useEffect, useState } from "react";
import { Body, Observer, Illumination, MoonPhase, SearchRiseSet } from "astronomy-engine";
import { Moon, Sunset } from "lucide-react";

const OBSERVER = new Observer(5.3599, -4.0083, 18);

const phaseEmoji = (angle: number) => {
  const a = ((angle % 360) + 360) % 360;
  if (a < 22.5 || a >= 337.5) return "🌑";
  if (a < 67.5) return "🌒";
  if (a < 112.5) return "🌓";
  if (a < 157.5) return "🌔";
  if (a < 202.5) return "🌕";
  if (a < 247.5) return "🌖";
  if (a < 292.5) return "🌗";
  return "🌘";
};

const LiveSkyBar = () => {
  const [info, setInfo] = useState<{ moon: string; illum: number; sunset: string } | null>(null);

  useEffect(() => {
    try {
      const now = new Date();
      const illum = Illumination(Body.Moon, now).phase_fraction;
      const angle = MoonPhase(now);
      const sunset = SearchRiseSet(Body.Sun, OBSERVER, -1, now, 1)?.date ?? null;
      setInfo({
        moon: phaseEmoji(angle),
        illum: Math.round(illum * 100),
        sunset: sunset
          ? sunset.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Abidjan" })
          : "—",
      });
    } catch {
      /* ignore */
    }
  }, []);

  if (!info) return null;

  return (
    <div className="hidden md:flex fixed top-[76px] right-4 z-40 items-center gap-4 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs text-white/80 shadow-lg animate-fade-in">
      <span className="flex items-center gap-1.5">
        <span className="text-base leading-none">{info.moon}</span>
        <Moon size={12} className="text-cosmic-gold" />
        <span className="font-mono text-white">{info.illum}%</span>
      </span>
      <span className="w-px h-3 bg-white/20" />
      <span className="flex items-center gap-1.5">
        <Sunset size={12} className="text-cosmic-gold" />
        <span>Coucher</span>
        <span className="font-mono text-white">{info.sunset}</span>
      </span>
    </div>
  );
};

export default LiveSkyBar;