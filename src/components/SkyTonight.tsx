import { useEffect, useMemo, useState } from "react";
import { Body, Observer, SearchRiseSet, Illumination, MoonPhase, Equator, Horizon } from "astronomy-engine";
import { Sun, Moon, Sunrise, Sunset, Telescope } from "lucide-react";

// Abidjan, Côte d'Ivoire
const OBSERVER = new Observer(5.3599, -4.0083, 18);

const fmt = (d: Date | null) =>
  d
    ? d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Abidjan" })
    : "—";

const phaseName = (angle: number) => {
  const a = ((angle % 360) + 360) % 360;
  if (a < 22.5 || a >= 337.5) return "Nouvelle Lune";
  if (a < 67.5) return "Premier croissant";
  if (a < 112.5) return "Premier quartier";
  if (a < 157.5) return "Gibbeuse croissante";
  if (a < 202.5) return "Pleine Lune";
  if (a < 247.5) return "Gibbeuse décroissante";
  if (a < 292.5) return "Dernier quartier";
  return "Dernier croissant";
};

const PLANETS: { body: Body; label: string }[] = [
  { body: Body.Mercury, label: "Mercure" },
  { body: Body.Venus, label: "Vénus" },
  { body: Body.Mars, label: "Mars" },
  { body: Body.Jupiter, label: "Jupiter" },
  { body: Body.Saturn, label: "Saturne" },
];

const SkyTonight = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const data = useMemo(() => {
    try {
      const sunrise = SearchRiseSet(Body.Sun, OBSERVER, +1, now, 1)?.date ?? null;
      const sunset = SearchRiseSet(Body.Sun, OBSERVER, -1, now, 1)?.date ?? null;
      const moonrise = SearchRiseSet(Body.Moon, OBSERVER, +1, now, 1)?.date ?? null;
      const moonset = SearchRiseSet(Body.Moon, OBSERVER, -1, now, 1)?.date ?? null;
      const illum = Illumination(Body.Moon, now);
      const phaseAngle = MoonPhase(now);

      const visible = PLANETS.map(({ body, label }) => {
        const eq = Equator(body, now, OBSERVER, true, true);
        const hor = Horizon(now, OBSERVER, eq.ra, eq.dec, "normal");
        return { label, altitude: hor.altitude };
      })
        .filter((p) => p.altitude > 5)
        .sort((a, b) => b.altitude - a.altitude);

      return {
        sunrise, sunset, moonrise, moonset,
        illumFrac: illum.phase_fraction,
        phase: phaseName(phaseAngle),
        visible,
      };
    } catch {
      return null;
    }
  }, [now]);

  return (
    <section id="sky" className="relative py-20 bg-gradient-to-b from-[#05060F] via-[#0a0a1f] to-[#05060F] overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
        backgroundImage: "radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 60%, #fff, transparent), radial-gradient(2px 2px at 40% 80%, rgba(255,215,120,0.7), transparent)",
        backgroundSize: "300px 300px, 400px 400px, 500px 500px"
      }} />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-cosmic-gold text-sm font-medium mb-4">
            <Telescope size={14} />
            Ciel d'Abidjan · en direct
          </div>
          <h2 className="font-space text-3xl md:text-5xl font-bold text-white mb-3">
            Ce que vous pouvez observer ce soir
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Calculs astronomiques en temps réel pour la région d'Abidjan.
          </p>
        </div>

        {data && (
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Soleil */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 hover:border-cosmic-gold/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-cosmic-gold/20 flex items-center justify-center">
                  <Sun className="text-cosmic-gold" size={22} />
                </div>
                <h3 className="font-space text-xl font-bold text-white">Soleil</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><Sunrise size={16} className="text-cosmic-gold/70" /> Lever</span>
                  <span className="font-mono text-white">{fmt(data.sunrise)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><Sunset size={16} className="text-cosmic-gold/70" /> Coucher</span>
                  <span className="font-mono text-white">{fmt(data.sunset)}</span>
                </div>
              </div>
            </div>

            {/* Lune */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 hover:border-cosmic-gold/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                  <Moon className="text-white" size={22} />
                </div>
                <h3 className="font-space text-xl font-bold text-white">Lune</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex justify-between">
                  <span>Phase</span>
                  <span className="text-white">{data.phase}</span>
                </div>
                <div className="flex justify-between">
                  <span>Illumination</span>
                  <span className="font-mono text-white">{Math.round(data.illumFrac * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Lever</span>
                  <span className="font-mono text-white">{fmt(data.moonrise)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coucher</span>
                  <span className="font-mono text-white">{fmt(data.moonset)}</span>
                </div>
              </div>
            </div>

            {/* Planètes */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 hover:border-cosmic-gold/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-cosmic-purple/30 flex items-center justify-center">
                  <Telescope className="text-white" size={22} />
                </div>
                <h3 className="font-space text-xl font-bold text-white">Planètes visibles</h3>
              </div>
              {data.visible.length === 0 ? (
                <p className="text-white/60 text-sm">Aucune planète majeure au-dessus de l'horizon actuellement.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {data.visible.map((p) => (
                    <li key={p.label} className="flex justify-between text-white/80">
                      <span>{p.label}</span>
                      <span className="font-mono text-cosmic-gold">{p.altitude.toFixed(0)}° au-dessus</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkyTonight;