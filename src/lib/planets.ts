type TraitCategory = 
    | 'Size' 
    | 'Surface & Geology'
    | 'Orbital' 
    | 'Atmosphere' 
    | 'Habitability' 
    | 'Life' 
    | 'Magnetic' 
    | 'Exotic'

type FullTrait = { trait: string; category: TraitCategory; description: string }

const planetTraits: FullTrait[] = [
    // Size
    { trait: 'Dwarf', category: 'Size', description: 'Not gravitationally dominant in its orbit.' },
    { trait: 'Super', category: 'Size', description: 'Significantly more massive than typical for its class.' },

    // Surface & Geology
    { trait: 'Volcanic', category: 'Surface & Geology', description: 'Active or extreme volcanism (Io-like).' },
    { trait: 'Ferrian', category: 'Surface & Geology', description: 'Iron-dominant composition, thin mantle.' },
    { trait: 'Glacial', category: 'Surface & Geology', description: 'Frozen surface, possible liquid subsurface ocean.' },
    { trait: 'Cratered', category: 'Surface & Geology', description: 'Ancient, geologically dead surface — heavily scarred by impacts with no resurfacing.' },
    { trait: 'Tectonic', category: 'Surface & Geology', description: 'Hyperactive plate tectonics — constant mountain-building, earthquakes, and rifting.' },
    { trait: 'Crystalline', category: 'Surface & Geology', description: 'Vast natural crystal formations dominate the surface — not exotic material, just extreme geology.' },
    { trait: 'Cavernous', category: 'Surface & Geology', description: 'Riddled with enormous cave systems, potentially larger than surface biomes.' },

    // Orbital
    { trait: 'Rogue', category: 'Orbital', description: 'Not bound to any star, drifting through interstellar space — cold and dark.' },
    { trait: 'Eccentric', category: 'Orbital', description: 'Highly elliptical orbit causes extreme seasonal swings between frozen and scorched.' },
    { trait: 'Tidally Locked', category: 'Orbital', description: 'One face permanently toward its star — one side baked, one side frozen.' },
    { trait: 'Trojan', category: 'Orbital', description: "Shares another planet's orbit, stable at a Lagrange point." },

    // Atmosphere
    { trait: 'Venusian', category: 'Atmosphere', description: 'Runaway greenhouse effect, crushing CO₂ atmosphere.' },
    { trait: 'Toxic', category: 'Atmosphere', description: 'Atmosphere is chemically hostile to most known life.' },
    { trait: 'Irradiated', category: 'Atmosphere', description: 'Orbits very close to its star — intense radiation and heat.' },
    { trait: 'Tempestuous', category: 'Atmosphere', description: 'Planet-wide permanent storm systems — winds violent enough to strip rock.' },
    { trait: 'Thin', category: 'Atmosphere', description: 'Negligible atmosphere — no weather, no pressure, surface fully exposed to space.' },

    // Habitability
    { trait: 'Desert', category: 'Habitability', description: 'Liquid water-scarce, arid conditions.' },
    { trait: 'Habitable', category: 'Habitability', description: 'Liquid water present, potentially life-bearing.' },

    // Life
    { trait: 'Biotic', category: 'Life', description: 'Some life present — microbial or sparse fauna/flora, no sentient life unless Sapient is also set.' },
    { trait: 'Verdant', category: 'Life', description: 'Abundant, thriving biosphere — rich ecosystems, no sentient life unless Sapient is also set.' },
    { trait: 'Sapient', category: 'Life', description: 'Sentient life exists — can combine with either Biotic or Verdant, or neither (i.e. a civilization that stripped its planet bare).' },
    { trait: 'Advanced Sapient', category: 'Life', description: 'Sentient life with FTL space travel exists — can combine with Biotic or Verdant, or neither (i.e. a civilization that stripped its planet bare).' },

    // Magnetic
    { trait: 'Magnetar', category: 'Magnetic', description: 'Abnormally powerful magnetic field — disrupts electronics, traps radiation belts.' },
    { trait: 'Demagnetized', category: 'Magnetic', description: 'No magnetic field whatsoever — surface fully exposed to stellar winds and radiation.' },

    // Exotic
    { trait: 'Psionic', category: 'Exotic', description: 'Home to a life form with telepathic powers — requires Verdant, Sapient, or Advanced Sapient trait.' },
    { trait: 'Liminal', category: 'Exotic', description: 'Space-time portals naturally occur on this planet.' },
    { trait: 'Chronal', category: 'Exotic', description: "Time flows vastly differently here than this planet's mass predicts." },
    { trait: 'Living', category: 'Exotic', description: 'This planet itself is a living organism — an extraordinarily massive connected system of living organic tissue, with its core serving as something analogous to a brain.' },
    { trait: 'Inverted', category: 'Exotic', description: 'This planet is hollow. The outer crust is barren, but the interior is vastly different — gravity flows toward the crust rather than the core.' },
    { trait: 'Ghostly', category: 'Exotic', description: 'This planet is out of phase with the rest of the universe. It appears translucent, and objects pass through it with some resistance but make no physical contact.' },
    { trait: 'Xenolithic', category: 'Exotic', description: 'This planet consists of an exotic material that makes up over 99% of its crust and mantle.' },
    { trait: 'Prismatic', category: 'Exotic', description: 'The atmosphere splits light into perpetual full-spectrum refraction — the sky is a constant rainbow.' },
    { trait: 'Resonant', category: 'Exotic', description: 'Gravitationally locked in precise orbital resonance with multiple bodies, causing unusual tidal forces.' },
    { trait: 'Negated', category: 'Exotic', description: 'Gravity behaves anomalously here — it weakens or reverses unpredictably at certain altitudes or regions.' },
    { trait: 'Acoustic', category: 'Exotic', description: 'Sound propagates in physically impossible ways here — across vacuum, through solid rock, or not at all.' },
];

export function getTrait(category: TraitCategory | 'Random'): FullTrait {
    if (category === 'Random') {
        return planetTraits[Math.floor(Math.random() * planetTraits.length)];
    } else {
        return planetTraits.find(t => t.category === category)!;
    }
}