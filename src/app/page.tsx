'use client';

import { useState, useEffect, useCallback } from 'react';
import { Exo_2, Space_Mono } from 'next/font/google';

const exo = Exo_2({
    subsets: ['latin'],
    weight: ['300', '400', '600', '700', '900'],
    variable: '--font-exo',
});
const mono = Space_Mono({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-mono',
});

interface Star {
    name: string;
    spectral_class: string; // e.g. "G2V", "M5V", "K3III"
    color: string;          // hex, e.g. "#FFF5C0" — used for glow / rendering
    luminosity: number;     // relative to Sol (1.0 = Sol)
    radius: number;         // relative to Sol (1.0 = Sol) — used to size the star dot
}

interface Planet {
    id: string;
    name: string;
    class: PlanetClass;
    traits: PlanetTrait[];
    mass: number;             // u32 → number, in Earth masses
    density: number;          // u32 → number, in kg/m³
    diameter: number;         // u32 → number, in km
    rotational_speed: number; // u32 → number, in km/h
    orbital_radius: number;   // in AU — used to position planet in orrery
    orbital_period: number;   // in Earth days
    color: string;            // hex — base display color for this planet
}

/**
 * Expected shape from GET /api/system
 * (no query parameters needed — server generates a random system)
 */
export interface SystemData {
    id: string;
    name: string;  // e.g. "Kelorath System"
    star: Star;
    planets: Planet[]; // 1–20 planets, ordered by orbital_radius ascending
}

// ─── Static Description Data ───────────────────────────────────────────────────

const CLASS_COLORS: Record<PlanetClass, { base: string; accent: string; label: string }> = {
    Rocky:      { base: '#C2956A', accent: '#C2956A33', label: '#E6B98A' },
    GasGiant:   { base: '#E8A44D', accent: '#E8A44D33', label: '#F5C47A' },
    IceGiant:   { base: '#5B9FBF', accent: '#5B9FBF33', label: '#89C4DC' },
    Oceanic:    { base: '#2C7BBF', accent: '#2C7BBF33', label: '#6BADD6' },
    Chthonian:  { base: '#7A7A8A', accent: '#7A7A8A33', label: '#A8A8B8' },
    SubNeptune: { base: '#8B7EC8', accent: '#8B7EC833', label: '#B0A5E0' },
};

const CLASS_DESCRIPTIONS: Record<PlanetClass, string> = {
    Rocky:
        'A world of silicate rock and mineral deposits. These terrestrial planets form in the inner regions of solar systems where heat prevents lighter gases from condensing. Surfaces range from barren cratered wastes to geologically active worlds with mountains, canyons, and valleys. Iron-nickel cores generate magnetic fields. Dense enough atmospheres may form from outgassing.',
    GasGiant:
        'A colossus of hydrogen and helium with no solid surface. These planetary titans form beyond the frost line where volatile compounds remained frozen, allowing massive cores to accrete enormous atmospheric envelopes. Interiors transition from gas to liquid to metallic hydrogen under crushing pressures. Their storms can persist for centuries.',
    IceGiant:
        'Unlike true gas giants, these worlds contain large quantities of water, ammonia, and methane ices surrounding a relatively small rocky core. Their "ices" exist in a hot, dense fluid state under extreme pressure. Distinctive blue-green hues come from methane gas absorbing red light. Their magnetic fields are often tilted dramatically off-axis.',
    Oceanic:
        'A world entirely covered by liquid water to depths that dwarf any ocean in the known galaxy. Some have thin ice crusts over global oceans; others are warm, endless seas beneath open skies. The pressure at extreme depths can force water into exotic high-pressure ice phases even at elevated temperatures.',
    Chthonian:
        'The exposed core of what was once a gas giant. Stripped of its gaseous envelope by the intense radiation of its host star or through close stellar encounters, only a dense, rocky and metallic remnant survives — scorched bare and orbiting extremely close to its star. These are among the most inhospitable worlds known.',
    SubNeptune:
        'Intermediate worlds between rocky super-Earths and ice giants. They possess thick hydrogen-rich atmospheres that prevent observation of underlying surfaces. They may have rocky or icy cores mantled by high-pressure steam oceans beneath dense atmospheric layers. This is the most common planet class detected around other stars.',
};

const TRAIT_DESCRIPTIONS: Record<PlanetTrait, string> = {
    Dwarf:
        'A world that has failed to gravitationally clear its orbital neighborhood. These smaller bodies share their orbital path with significant quantities of similar objects and lack the gravitational influence to dominate their region of space.',
    Super:
        'A significantly more massive example of its planetary class. The additional mass creates stronger surface gravity, higher atmospheric pressure, and often more intense geological or atmospheric activity than a typical member of its class.',
    Volcanic:
        'A world of relentless geological violence. Hundreds or thousands of active volcanoes constantly resurface the planet, pumping sulfur dioxide, ash, and pyroclastic material into the atmosphere. The surface is a hellscape of lava lakes and freshly formed rock still glowing from the heat below.',
    Ferrian:
        'An iron-dominant world with a disproportionately large metallic core relative to its silicate mantle. This results from ancient giant impacts stripping away lighter crustal material, or from formation close to the star where iron condensed preferentially. The surface is typically dark grey to rusty red.',
    Glacial:
        'A frozen world where surface temperatures have dropped below the freezing point of water or other volatiles. Despite the frozen surface, many glacial worlds harbor liquid oceans beneath their icy shells, kept warm by tidal heating or residual internal heat — a potential cradle for life far from the light.',
    Cratered:
        'An ancient world whose surface has not been renewed by volcanism, tectonics, or erosion for billions of years. Every impact in the planet\'s history has been preserved, creating a heavily scarred record of the solar system\'s violent past. It is geologically dead, its story written in craters.',
    Tectonic:
        'A world in constant crustal upheaval. Hyperactive plate tectonics continuously creates and destroys surface material. Constant earthquakes, active mountain-building, volcanic arcs, and deep rifts define this restless world. The landscape is never stable for more than a few million years.',
    Crystalline:
        'A world dominated by vast formations of natural crystal. Not exotic material — but extreme geological conditions, the right chemistry, pressure, and slow cooling over millions of years — have produced crystals on a scale that would be considered impossible on typical worlds. Caves and plains gleam and refract light.',
    Cavernous:
        'A world riddled with cave systems of staggering scale — caverns potentially larger than surface continents. Whether formed by lava tubes, dissolution, or structural collapse, these underground spaces represent entirely distinct environments, potentially with ecosystems isolated from the surface for millions of years.',
    Rogue:
        'A planet unbound from any stellar system, drifting through the cold dark of interstellar space. Without a sun to warm it, the surface approaches absolute zero. Any internal heat source — radioactive decay, tidal flexing — becomes the only potential driver of subsurface activity or liquid water.',
    Eccentric:
        'A world with a highly elliptical orbit, carrying it from the frigid depths of the outer system to the scorching inner zone with each revolution. This creates extreme seasonal variation that makes stable climates and life development extremely challenging across the whole planetary surface.',
    TidallyLocked:
        'A world that rotates at exactly the same rate it orbits its star, keeping one hemisphere in permanent daylight and the other in eternal night. The day side is baked by constant stellar radiation; the night side freezes. A narrow terminator zone of eternal twilight may be the only habitable region.',
    Trojan:
        'A planet occupying one of two gravitationally stable Lagrange points in another planet\'s orbit — either 60° ahead or behind. These are gravitational sweet spots where the combined pull of the star and the primary planet keeps the trojan in stable co-orbital resonance indefinitely.',
    Venusian:
        'A world in the grip of a runaway greenhouse effect. Carbon dioxide and other greenhouse gases trap heat so effectively that surface temperatures can exceed the melting point of lead. Atmospheric pressure at the surface can crush spacecraft, and clouds of sulfuric acid rain from an eternally overcast sky.',
    Toxic:
        'An atmosphere lethally hostile to most known life. This may include concentrations of chlorine, ammonia, hydrogen sulfide, or other reactive chemicals that would destroy biological tissue on contact. Even organisms adapted to extreme environments would struggle to survive prolonged exposure.',
    Irradiated:
        'A world subjected to intense particle and electromagnetic radiation from its nearby star. Without adequate magnetic shielding, this bombardment sterilizes surfaces, destroys complex chemistry, and strips atmospheric gases into space. The surface is a perpetual radiation storm bathed in harmful energy.',
    Tempestuous:
        'A world of permanent, planet-spanning storm systems of terrifying intensity. Winds reach speeds capable of stripping rock from surfaces. These are not weather events but permanent atmospheric states — the planet\'s natural equilibrium is one of constant, unbroken atmospheric violence.',
    Thin:
        'A world with an atmosphere too tenuous to provide meaningful pressure, insulation, or protection. The surface is essentially exposed to the vacuum of space and stellar radiation. Without atmospheric pressure, liquids instantly vaporize and biological processes as we know them are impossible at the surface.',
    Desert:
        'A world where liquid water is vanishingly scarce on the surface. This may result from proximity to the star, lack of water delivery during formation, or loss of water to space over time. The surface is dominated by dry rock, sand, and dust, with any remaining water locked in polar ice or deep subsurface aquifers.',
    Habitable:
        'A world capable of supporting liquid water on its surface and possessing conditions compatible with life as we understand it. Temperature, pressure, and atmospheric composition fall within ranges that allow complex chemistry and potentially biological processes to emerge and persist.',
    Biotic:
        'Life exists here — ranging from microbial mats in isolated pockets of habitability to sparse fauna and flora. The biosphere is not lush or dominant, but living organisms are detectable. No sentient life has emerged unless the Sapient trait is also present.',
    Verdant:
        'A world teeming with life in rich, complex ecosystems. Vegetation analogs blanket the surface, animal-equivalent fauna occupy multiple ecological niches, and the biosphere has driven significant changes to the atmosphere and geology. Life here has thrived long enough to become world-shaping.',
    Sapient:
        'Sentient beings capable of abstract thought, communication, and civilization have emerged. Their development level varies widely — from early tool use to near-spacefaring — but they are aware of their existence in a complex universe and have begun to shape their world with intention.',
    AdvancedSapient:
        'A civilization with mastery of faster-than-light travel calls this world home. They have spread beyond their system of origin and are an interstellar species. Their technological capabilities would appear godlike to less advanced civilizations, and their world bears the deep marks of their long presence.',
    Magnetar:
        'An abnormally powerful planetary magnetic field, orders of magnitude stronger than typical. This field traps intense radiation belts around the planet, disrupts electronic systems on approach, and creates spectacular polar light phenomena. Its origin may be an unusually rapid rotation or exotic core composition.',
    Demagnetized:
        'A planet with no meaningful magnetic field. Without this protective shield, the stellar wind strips atmospheric gases directly to space, and the surface receives the full brunt of stellar radiation. Over long timescales, atmospheres are progressively lost and the surface is scoured clean.',
    Psionic:
        'Life on this world has evolved or developed telepathic capabilities. Whether through biological evolution or something more exotic, organisms here communicate, perceive, and potentially manipulate reality through means outside conventional physical interaction. Requires sentient or biotic life to be present.',
    Liminal:
        'Space-time is unstable on this world. Naturally occurring portals or wormholes spontaneously open and close across the surface, potentially connecting it to entirely different regions of the galaxy or universe. The physics generating these phenomena are not understood. Travel through them is unpredictable.',
    Chronal:
        'Time flows at a measurably different rate on this world compared to what its mass and gravity should predict. Whether faster or slower, an observer watching from outside would see events unfold at an anomalous pace. The cause is unknown; the effect is real, consistent, and scientifically inexplicable.',
    Living:
        'This planet is itself a living organism of incomprehensible scale. The entirety of its crust, mantle, and perhaps core are integrated into a single, ancient biological system. Its brain — the closest analog to a central intelligence — is its core. It is aware, in whatever way something so alien can be aware.',
    Inverted:
        'This planet is hollow. The rocky outer crust is barren, but inside is an entirely different world where gravity points outward toward the crust rather than inward to the core. The interior may harbor its own ecosystems, weather patterns, and a small artificial light source to drive them.',
    Ghostly:
        'This planet exists in a state of partial phase displacement with normal spacetime. It appears translucent against the stars. Physical objects pass through it with significant resistance — like moving through dense fluid — but make no true physical contact with its matter. It cannot be landed upon by conventional means.',
    Xenolithic:
        'Over 99% of this planet\'s crust and mantle is composed of a material matching no element or compound in known scientific catalogs. Its properties — density, conductivity, reactivity — do not follow standard physical models. It may have originated from another universe or represent physics not yet understood.',
    Prismatic:
        'The atmospheric composition causes incoming starlight to be refracted into its full spectrum in a continuous, planet-wide display. The sky is never a single color but shifts through perpetual rainbow gradients. At night, even starlight is split and scattered. Observers report the visual effect as overwhelming.',
    Resonant:
        'This planet is locked in precise gravitational resonance with multiple other bodies in the system simultaneously. The resulting tidal forces are unusual — neither destructive nor negligible — creating rhythmic geological and atmospheric cycles synchronized to the orbital dance of its neighbors.',
    Negated:
        'Gravity behaves anomalously on this world. At certain altitudes or regions, gravitational acceleration weakens dramatically or reverses. Objects at these altitudes drift upward as readily as they fall. The phenomenon is consistent and predictable, but physically inexplicable under any current theoretical model.',
    Acoustic:
        'Sound propagates in physically impossible ways. It may carry through the vacuum above the atmosphere, transmit through solid rock at city-spanning distances, or conversely fail to propagate even through dense air. Instruments here produce sounds that carry in ways that violate every known model of wave mechanics.',
};

const TRAIT_STYLE: Record<PlanetTrait, { color: string; category: string }> = {
    Dwarf:          { color: '#94A3B8', category: 'Size' },
    Super:          { color: '#CBD5E1', category: 'Size' },
    Volcanic:       { color: '#FB923C', category: 'Geology' },
    Ferrian:        { color: '#A16207', category: 'Geology' },
    Glacial:        { color: '#BAE6FD', category: 'Geology' },
    Cratered:       { color: '#A8A29E', category: 'Geology' },
    Tectonic:       { color: '#EAB308', category: 'Geology' },
    Crystalline:    { color: '#C4B5FD', category: 'Geology' },
    Cavernous:      { color: '#92400E', category: 'Geology' },
    Rogue:          { color: '#475569', category: 'Orbital' },
    Eccentric:      { color: '#F59E0B', category: 'Orbital' },
    TidallyLocked: { color: '#F87171', category: 'Orbital' },
    Trojan:         { color: '#4ADE80', category: 'Orbital' },
    Venusian:       { color: '#EF4444', category: 'Atmosphere' },
    Toxic:          { color: '#86EFAC', category: 'Atmosphere' },
    Irradiated:     { color: '#FDE047', category: 'Atmosphere' },
    Tempestuous:    { color: '#7DD3FC', category: 'Atmosphere' },
    Thin:           { color: '#CBD5E1', category: 'Atmosphere' },
    Desert:         { color: '#D97706', category: 'Surface' },
    Habitable:      { color: '#34D399', category: 'Surface' },
    Biotic:         { color: '#4ADE80', category: 'Life' },
    Verdant:        { color: '#22C55E', category: 'Life' },
    Sapient:        { color: '#38BDF8', category: 'Life' },
    AdvancedSapient:{ color: '#818CF8', category: 'Life' },
    Magnetar:       { color: '#A78BFA', category: 'Magnetic' },
    Demagnetized:   { color: '#64748B', category: 'Magnetic' },
    Psionic:        { color: '#E879F9', category: 'Exotic' },
    Liminal:        { color: '#67E8F9', category: 'Exotic' },
    Chronal:        { color: '#FBBF24', category: 'Exotic' },
    Living:         { color: '#86EFAC', category: 'Exotic' },
    Inverted:       { color: '#93C5FD', category: 'Exotic' },
    Ghostly:        { color: '#E2E8F0', category: 'Exotic' },
    Xenolithic:     { color: '#F0ABFC', category: 'Exotic' },
    Prismatic:      { color: '#FDE68A', category: 'Exotic' },
    Resonant:       { color: '#A5F3FC', category: 'Exotic' },
    Negated:        { color: '#FB7185', category: 'Exotic' },
    Acoustic:       { color: '#6EE7B7', category: 'Exotic' },
};

const EXOTIC_TRAITS = new Set<PlanetTrait>([
    'Psionic', 'Liminal', 'Chronal', 'Living', 'Inverted',
    'Ghostly', 'Xenolithic', 'Prismatic', 'Resonant', 'Negated', 'Acoustic',
]);

// ─── Utilities ─────────────────────────────────────────────────────────────────

function lerp(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    if (inMax === inMin) return (outMin + outMax) / 2;
    const t = Math.min(1, Math.max(0, (value - inMin) / (inMax - inMin)));
    return outMin + t * (outMax - outMin);
}

function fmt(n: number) {
    return n.toLocaleString('en-US');
}

// ─── Orrery ────────────────────────────────────────────────────────────────────

const GOLDEN = 137.508;
const CX = 400;
const CY = 400;
const MIN_RING = 72;
const MAX_RING = 368;
const STAR_MAX_R = 32;
const STAR_MIN_R = 10;

interface OrreryProps {
    system: SystemData;
    selectedPlanet: Planet | null;
    onSelectPlanet: (planet: Planet) => void;
}

function Orrery({ system, selectedPlanet, onSelectPlanet }: OrreryProps) {
    const { planets, star } = system;
    const n = planets.length;

    const minOrb  = n > 1 ? Math.min(...planets.map(p => p.orbital_radius)) : 1;
    const maxOrb  = n > 1 ? Math.max(...planets.map(p => p.orbital_radius)) : 1;
    const minDiam = Math.min(...planets.map(p => p.diameter));
    const maxDiam = Math.max(...planets.map(p => p.diameter));

    // Star visual size clamped by luminosity
    const starR = Math.min(STAR_MAX_R, Math.max(STAR_MIN_R, star.radius * 18));

    return (
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
            <svg
                viewBox="0 0 800 800"
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    {/* Deep space radial bg */}
                    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
                        <stop offset="0%"   stopColor="#0B1625" />
                        <stop offset="100%" stopColor="#040810" />
                    </radialGradient>

                    {/* Star glow */}
                    <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%"   stopColor={star.color} stopOpacity="0.9" />
                        <stop offset="40%"  stopColor={star.color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={star.color} stopOpacity="0"   />
                    </radialGradient>

                    {/* Per-planet radial gradients (shaded sphere look) */}
                    {planets.map(p => (
                        <radialGradient key={p.id} id={`pg-${p.id}`} cx="38%" cy="32%" r="62%">
                            <stop offset="0%"   stopColor={p.color} stopOpacity="1"   />
                            <stop offset="100%" stopColor={p.color} stopOpacity="0.4" />
                        </radialGradient>
                    ))}

                    {/* Glow filter for selected / exotic */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="glow-heavy" x="-80%" y="-80%" width="260%" height="260%">
                        <feGaussianBlur stdDeviation="7" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="star-filter" x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Background */}
                <rect width="800" height="800" fill="url(#bg)" rx="16" />

                {/* Static star-field */}
                {Array.from({ length: 100 }, (_, i) => {
                    const x = ((i * 97 + 17) % 800);
                    const y = ((i * 61 + 53) % 800);
                    const r = i % 7 === 0 ? 1.3 : 0.65;
                    const op = 0.15 + (i % 9) * 0.07;
                    return <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={op} />;
                })}

                {/* Orbital rings */}
                {planets.map((p, i) => {
                    const ringR = n === 1
                        ? (MIN_RING + MAX_RING) / 2
                        : lerp(p.orbital_radius, minOrb, maxOrb, MIN_RING, MAX_RING);
                    const isSel = selectedPlanet?.id === p.id;
                    return (
                        <circle
                            key={`ring-${p.id}`}
                            cx={CX} cy={CY} r={ringR}
                            fill="none"
                            stroke={isSel ? p.color : 'rgba(255,255,255,0.07)'}
                            strokeWidth={isSel ? 1.2 : 0.5}
                            strokeDasharray={isSel ? '4 6' : undefined}
                        />
                    );
                })}

                {/* Star halo */}
                <circle cx={CX} cy={CY} r={starR * 5.5} fill="url(#starGlow)" opacity="0.55" />

                {/* Star body */}
                <circle
                    cx={CX} cy={CY} r={starR}
                    fill={star.color}
                    filter="url(#star-filter)"
                />
                {/* Star corona highlight */}
                <circle cx={CX - starR * 0.25} cy={CY - starR * 0.25} r={starR * 0.45} fill="white" opacity="0.3" />

                {/* Star label */}
                <text
                    x={CX} y={CY + starR + 14}
                    textAnchor="middle"
                    fill={star.color}
                    fontSize="8"
                    fontFamily="'Space Mono', monospace"
                    opacity="0.75"
                    letterSpacing="1"
                >
                    {star.name}
                </text>

                {/* Planets */}
                {planets.map((p, i) => {
                    const ringR = n === 1
                        ? (MIN_RING + MAX_RING) / 2
                        : lerp(p.orbital_radius, minOrb, maxOrb, MIN_RING, MAX_RING);
                    const pr = lerp(p.diameter, minDiam, maxDiam, 4, 13);
                    const angle = ((i * GOLDEN) % 360) * (Math.PI / 180);
                    const px = CX + ringR * Math.cos(angle);
                    const py = CY + ringR * Math.sin(angle);
                    const isSel  = selectedPlanet?.id === p.id;
                    const isExot = p.traits.some(t => EXOTIC_TRAITS.has(t));

                    return (
                        <g
                            key={p.id}
                            onClick={() => onSelectPlanet(p)}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Selection ring */}
                            {isSel && (
                                <circle
                                    cx={px} cy={py} r={pr + 5}
                                    fill="none"
                                    stroke={p.color}
                                    strokeWidth="1.5"
                                    opacity="0.9"
                                />
                            )}

                            {/* Exotic shimmer */}
                            {isExot && (
                                <circle
                                    cx={px} cy={py} r={pr + 2}
                                    fill={p.color}
                                    opacity="0.18"
                                    filter="url(#glow-heavy)"
                                />
                            )}

                            {/* Planet sphere */}
                            <circle
                                cx={px} cy={py} r={pr}
                                fill={`url(#pg-${p.id})`}
                                filter={isSel ? 'url(#glow)' : isExot ? 'url(#glow)' : undefined}
                            />

                            {/* Name label — only on hover-ish: always show, small */}
                            <text
                                x={px}
                                y={py + pr + 11}
                                textAnchor="middle"
                                fill={isSel ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)'}
                                fontSize={isSel ? '7.5' : '6.5'}
                                fontFamily="'Space Mono', monospace"
                            >
                                {p.name}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

// ─── Description Modal ─────────────────────────────────────────────────────────

interface DescModalProps {
    title: string;
    body: string;
    isExotic: boolean;
    accentColor?: string;
    onClose: () => void;
}

function DescModal({ title, body, isExotic, accentColor = '#ffffff', onClose }: DescModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.65)' }} />
            <div
                className="relative z-10 max-w-sm w-full rounded-2xl p-6"
                style={{
                    background: 'linear-gradient(145deg, #0E1B2E 0%, #08111F 100%)',
                    border: `1px solid ${accentColor}30`,
                    boxShadow: `0 0 40px ${accentColor}15`,
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        {isExotic && (
                            <div className={`text-xs mb-1 ${mono.className}`} style={{ color: accentColor, opacity: 0.7 }}>
                                ✦ EXOTIC
                            </div>
                        )}
                        <h3
                            className={`text-base font-bold text-white ${exo.className}`}
                            style={{ letterSpacing: '0.05em' }}
                        >
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/30 hover:text-white/70 transition-colors text-xl leading-none ml-4 mt-0.5"
                    >
                        ×
                    </button>
                </div>
                <p
                    className={`text-sm leading-relaxed ${mono.className}`}
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                    {body}
                </p>
            </div>
        </div>
    );
}

// ─── Planet Detail Panel ───────────────────────────────────────────────────────

interface PlanetDetailProps {
    planet: Planet;
    onShowDesc: (title: string, body: string, isExotic: boolean, color?: string) => void;
    onClose: () => void;
}

function PlanetDetail({ planet, onShowDesc, onClose }: PlanetDetailProps) {
    const cls = CLASS_COLORS[planet.class];

    const stats: { label: string; value: string }[] = [
        { label: 'MASS',        value: `${fmt(planet.mass)} M⊕`  },
        { label: 'DIAMETER',    value: `${fmt(planet.diameter)} km`  },
        { label: 'DENSITY',     value: `${fmt(planet.density)} kg/m³` },
        { label: 'ROTATION',    value: `${fmt(planet.rotational_speed)} km/h` },
        { label: 'ORBIT',       value: `${planet.orbital_radius.toFixed(3)} AU` },
        { label: 'PERIOD',      value: `${planet.orbital_period.toFixed(1)} days` },
    ];

    // Group traits by category
    const grouped: Record<string, PlanetTrait[]> = {};
    for (const trait of planet.traits) {
        const cat = TRAIT_STYLE[trait].category;
        (grouped[cat] ??= []).push(trait);
    }

    return (
        <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2
                        className={`text-xl font-bold leading-tight ${exo.className}`}
                        style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '0.04em' }}
                    >
                        {planet.name}
                    </h2>
                    <button
                        onClick={() => onShowDesc(planet.class, CLASS_DESCRIPTIONS[planet.class], false, cls.base)}
                        className={`text-xs font-semibold mt-1.5 transition-opacity hover:opacity-100 opacity-80 inline-flex items-center gap-1 ${exo.className}`}
                        style={{ color: cls.label }}
                    >
                        ◈ {planet.class}
                        <span className="opacity-50">›</span>
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="text-white/25 hover:text-white/60 transition-colors text-xl leading-none pt-0.5"
                >
                    ×
                </button>
            </div>

            {/* Planet Visual */}
            <div className="flex justify-center">
                <div
                    className="rounded-full"
                    style={{
                        width: 72,
                        height: 72,
                        background: `radial-gradient(circle at 36% 32%, ${planet.color}ff 0%, ${planet.color}55 100%)`,
                        boxShadow: `0 0 28px ${planet.color}55, 0 0 60px ${planet.color}1A`,
                    }}
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
                {stats.map(({ label, value }) => (
                    <div
                        key={label}
                        className="rounded-lg px-3 py-2.5"
                        style={{
                            background: 'rgba(255,255,255,0.035)',
                            border: '1px solid rgba(255,255,255,0.07)',
                        }}
                    >
                        <div
                            className={`text-xs mb-1 ${exo.className}`}
                            style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}
                        >
                            {label}
                        </div>
                        <div
                            className={`text-xs font-semibold ${mono.className}`}
                            style={{ color: 'rgba(255,255,255,0.82)' }}
                        >
                            {value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Traits */}
            {planet.traits.length > 0 && (
                <div>
                    <div
                        className={`text-xs mb-3 ${exo.className}`}
                        style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}
                    >
                        TRAITS
                    </div>
                    {Object.entries(grouped).map(([cat, traits]) => (
                        <div key={cat} className="mb-3">
                            <div
                                className={`text-xs mb-1.5 ${mono.className}`}
                                style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}
                            >
                                {cat}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {traits.map(trait => {
                                    const ts      = TRAIT_STYLE[trait];
                                    const isExot  = EXOTIC_TRAITS.has(trait);
                                    return (
                                        <button
                                            key={trait}
                                            onClick={() =>
                                                onShowDesc(trait, TRAIT_DESCRIPTIONS[trait], isExot, ts.color)
                                            }
                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        transition-all duration-150 hover:scale-105 active:scale-100 ${mono.className}`}
                                            style={{
                                                background: `${ts.color}14`,
                                                border: `1px solid ${ts.color}${isExot ? 'AA' : '40'}`,
                                                color: ts.color,
                                                boxShadow: isExot ? `0 0 10px ${ts.color}35` : undefined,
                                            }}
                                        >
                                            {isExot ? '✦ ' : ''}{trait}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {planet.traits.length === 0 && (
                <p
                    className={`text-xs ${mono.className}`}
                    style={{ color: 'rgba(255,255,255,0.2)' }}
                >
                    No modifying traits.
                </p>
            )}
        </div>
    );
}

// ─── Planet Strip ──────────────────────────────────────────────────────────────

interface PlanetStripProps {
    planets: Planet[];
    selectedPlanet: Planet | null;
    onSelectPlanet: (p: Planet) => void;
}

function PlanetStrip({ planets, selectedPlanet, onSelectPlanet }: PlanetStripProps) {
    const minD = Math.min(...planets.map(p => p.diameter));
    const maxD = Math.max(...planets.map(p => p.diameter));

    return (
        <div
            className="flex items-center gap-4 px-6 py-3 overflow-x-auto"
            style={{ scrollbarWidth: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
            {planets.map(p => {
                const sz     = Math.round(lerp(p.diameter, minD, maxD, 18, 38));
                const isSel  = selectedPlanet?.id === p.id;
                const isExot = p.traits.some(t => EXOTIC_TRAITS.has(t));
                return (
                    <button
                        key={p.id}
                        onClick={() => onSelectPlanet(p)}
                        className="flex flex-col items-center gap-1.5 flex-shrink-0 transition-all duration-200"
                        style={{ opacity: isSel ? 1 : 0.55, transform: isSel ? 'translateY(-2px)' : undefined }}
                    >
                        <div
                            className="rounded-full transition-shadow duration-200"
                            style={{
                                width: sz,
                                height: sz,
                                background: `radial-gradient(circle at 36% 32%, ${p.color}ff, ${p.color}50)`,
                                boxShadow: isSel
                                    ? `0 0 16px ${p.color}70, 0 0 32px ${p.color}30`
                                    : isExot
                                        ? `0 0 8px ${p.color}40`
                                        : undefined,
                                border: isSel ? `1.5px solid ${p.color}99` : '1.5px solid transparent',
                            }}
                        />
                        <span
                            className={`text-xs leading-none ${mono.className}`}
                            style={{
                                color: isSel ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.3)',
                                fontSize: 9,
                                whiteSpace: 'nowrap',
                            }}
                        >
              {p.name}
            </span>
                    </button>
                );
            })}
        </div>
    );
}

// ─── Loading / Error ───────────────────────────────────────────────────────────

function LoadingScreen() {
    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center gap-3 ${exo.className}`}
            style={{ background: '#040810' }}
        >
            <div className="flex gap-2">
                {[0, 1, 2, 3].map(i => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ background: 'rgba(255,255,255,0.3)', animationDelay: `${i * 0.12}s` }}
                    />
                ))}
            </div>
            <div
                className={`text-xs tracking-widest animate-pulse ${mono.className}`}
                style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.25em' }}
            >
                SCANNING SYSTEM
            </div>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

interface ActiveDesc {
    title: string;
    body: string;
    isExotic: boolean;
    color?: string;
}

export default function SolarSystemPage() {
    const [system,          setSystem]   = useState<SystemData | null>(null);
    const [loading,         setLoading]  = useState(true);
    const [error,           setError]    = useState<string | null>(null);
    const [selectedPlanet,  setSelected] = useState<Planet | null>(null);
    const [activeDesc,      setDesc]     = useState<ActiveDesc | null>(null);

    const fetchSystem = useCallback(() => {
        setLoading(true);
        setError(null);
        setSelected(null);

        fetch('/api/system')
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
                return r.json() as Promise<SystemData>;
            })
            .then(data => { setSystem(data); setLoading(false); })
            .catch((e: Error) => { setError(e.message); setLoading(false); });
    }, []);

    useEffect(() => { fetchSystem(); }, [fetchSystem]);

    function handleShowDesc(title: string, body: string, isExotic: boolean, color?: string) {
        setDesc({ title, body, isExotic, color });
    }

    if (loading) return <LoadingScreen />;

    if (error || !system) {
        return (
            <div
                className={`min-h-screen flex flex-col items-center justify-center gap-4 ${exo.className}`}
                style={{ background: '#040810' }}
            >
                <p className={`text-xs ${mono.className}`} style={{ color: 'rgba(239,68,68,0.6)' }}>
                    {error ?? 'Failed to load system.'}
                </p>
                <button
                    onClick={fetchSystem}
                    className={`text-xs tracking-widest transition-opacity hover:opacity-100 opacity-50 ${mono.className}`}
                    style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em' }}
                >
                    RETRY
                </button>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen flex flex-col ${exo.className}`}
            style={{ background: 'linear-gradient(160deg, #060D1C 0%, #040810 60%, #050B18 100%)' }}
        >
            {/* ── Header ── */}
            <header
                className="flex items-center justify-between px-5 py-3 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
                <div>
                    <h1
                        className={`text-base font-bold tracking-wide ${exo.className}`}
                        style={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '0.08em' }}
                    >
                        {system.name}
                    </h1>
                    <div
                        className={`text-xs mt-0.5 ${mono.className}`}
                        style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em' }}
                    >
                        {system.star.spectral_class} · {system.planets.length}{' '}
                        {system.planets.length === 1 ? 'planet' : 'planets'}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Star chip */}
                    <div
                        className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${mono.className}`}
                        style={{
                            border: `1px solid ${system.star.color}33`,
                            background: `${system.star.color}0D`,
                            color: system.star.color,
                            letterSpacing: '0.08em',
                        }}
                    >
                        <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{
                                background: system.star.color,
                                boxShadow: `0 0 6px ${system.star.color}80`,
                            }}
                        />
                        {system.star.name}
                    </div>

                    <button
                        onClick={fetchSystem}
                        className={`px-3 py-1.5 rounded-lg text-xs tracking-widest transition-all
              hover:bg-white/10 active:scale-95 ${mono.className}`}
                        style={{
                            color: 'rgba(255,255,255,0.4)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            letterSpacing: '0.14em',
                        }}
                    >
                        ↻ NEW SYSTEM
                    </button>
                </div>
            </header>

            {/* ── Main: Orrery + Panel ── */}
            <div className="flex flex-1 min-h-0 flex-col lg:flex-row overflow-hidden">

                {/* Orrery area */}
                <div className="flex-1 flex items-center justify-center p-5 lg:p-8 min-h-0">
                    <div className="w-full max-w-[min(100%,520px)]">
                        <Orrery
                            system={system}
                            selectedPlanet={selectedPlanet}
                            onSelectPlanet={setSelected}
                        />
                    </div>
                </div>

                {/* Side Panel */}
                <div
                    className="w-full lg:w-72 xl:w-80 flex-shrink-0 p-5 flex flex-col overflow-hidden
            lg:border-l"
                    style={{
                        borderColor: 'rgba(255,255,255,0.05)',
                        background: 'rgba(255,255,255,0.016)',
                    }}
                >
                    {selectedPlanet ? (
                        <PlanetDetail
                            planet={selectedPlanet}
                            onShowDesc={handleShowDesc}
                            onClose={() => setSelected(null)}
                        />
                    ) : (
                        <div
                            className="flex flex-col items-center justify-center flex-1 text-center gap-3 py-10"
                        >
                            <div className="text-4xl" style={{ opacity: 0.12 }}>◈</div>
                            <p
                                className={`text-xs max-w-36 leading-relaxed ${mono.className}`}
                                style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}
                            >
                                Select a planet from the orrery to explore it
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Planet Strip ── */}
            <div className="flex-shrink-0">
                <PlanetStrip
                    planets={system.planets}
                    selectedPlanet={selectedPlanet}
                    onSelectPlanet={setSelected}
                />
            </div>

            {/* ── Description Modal ── */}
            {activeDesc && (
                <DescModal
                    title={activeDesc.title}
                    body={activeDesc.body}
                    isExotic={activeDesc.isExotic}
                    accentColor={activeDesc.color}
                    onClose={() => setDesc(null)}
                />
            )}
        </div>
    );
}