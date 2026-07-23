const ConstellationDivider = () => (
  <div className="relative h-24 bg-[#05060F] overflow-hidden" aria-hidden="true">
    <svg
      viewBox="0 0 1200 96"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
    >
      <defs>
        <linearGradient id="constellation-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="hsl(var(--cosmic-gold))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--cosmic-gold))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(var(--cosmic-gold))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M60 60 L280 30 L440 55 L620 20 L780 50 L960 25 L1140 55"
        stroke="url(#constellation-line)"
        strokeWidth="1"
        fill="none"
      />
      {[
        [60, 60], [280, 30], [440, 55], [620, 20], [780, 50], [960, 25], [1140, 55],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={i % 2 === 0 ? 2 : 1.5}
          fill="hsl(var(--cosmic-gold))"
          className="constellation-node"
          style={{ animationDelay: `${i * 0.35}s`, transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
    </svg>
  </div>
);

export default ConstellationDivider;