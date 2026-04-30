import {Planet, PlanetClass, PlanetTrait} from "@/types";

type TraitCategory =
    | 'Size' 
    | 'Surface & Geology'
    | 'Orbital' 
    | 'Atmosphere' 
    | 'Habitability' 
    | 'Life' 
    | 'Magnetic' 
    | 'Exotic'

type FullTrait = { trait: PlanetTrait; category: TraitCategory; description: string }
type FullClass = { class: PlanetClass; description: string }

const planetTraits: FullTrait[] = [
    // Size
    { trait: 'Dwarf', category: 'Size', description: 'Not gravitationally dominant in its orbit.' },
    { trait: 'Super', category: 'Size', description: 'Significantly more massive than typical for its class.' },

    // Surface & Geology
    { trait: 'Volcanic', category: 'Surface & Geology', description: 'Active or extreme volcanism (Io-like).' },
    { trait: 'Ferrian', category: 'Surface & Geology', description: 'Iron-dominant composition, thin mantle.' },
    { trait: 'Glacial', category: 'Surface & Geology', description: 'Frozen surface, possible liquid subsurface ocean.' },
    { trait: 'Cratered', category: 'Surface & Geology', description: 'Ancient, geologically dead surface - heavily scarred by impacts with no resurfacing.' },
    { trait: 'Tectonic', category: 'Surface & Geology', description: 'Hyperactive plate tectonics - constant mountain-building, earthquakes, and rifting.' },
    { trait: 'Crystalline', category: 'Surface & Geology', description: 'Vast natural crystal formations dominate the surface - not exotic material, just extreme geology.' },
    { trait: 'Cavernous', category: 'Surface & Geology', description: 'Riddled with enormous cave systems, potentially larger than surface biomes.' },

    // Orbital
    { trait: 'Rogue', category: 'Orbital', description: 'Not bound to any star, drifting through interstellar space - cold and dark.' },
    { trait: 'Eccentric', category: 'Orbital', description: 'Highly elliptical orbit causes extreme seasonal swings between frozen and scorched.' },
    { trait: 'Tidally Locked', category: 'Orbital', description: 'One face permanently toward its star - one side baked, one side frozen.' },
    { trait: 'Trojan', category: 'Orbital', description: "Shares another planet's orbit, stable at a Lagrange point." },

    // Atmosphere
    { trait: 'Venusian', category: 'Atmosphere', description: 'Runaway greenhouse effect, crushing CO₂ atmosphere.' },
    { trait: 'Toxic', category: 'Atmosphere', description: 'Atmosphere is chemically hostile to most known life.' },
    { trait: 'Irradiated', category: 'Atmosphere', description: 'Orbits very close to its star - intense radiation and heat.' },
    { trait: 'Tempestuous', category: 'Atmosphere', description: 'Planet-wide permanent storm systems - winds violent enough to strip rock.' },
    { trait: 'Thin', category: 'Atmosphere', description: 'Negligible atmosphere - no weather, no pressure, surface fully exposed to space.' },

    // Habitability
    { trait: 'Desert', category: 'Habitability', description: 'Liquid water-scarce, arid conditions.' },
    { trait: 'Habitable', category: 'Habitability', description: 'Liquid water present, potentially life-bearing.' },
    { trait: 'Terraformed', category: 'Habitability', description: 'This world used to be barren and inhospitable to life. It has since been transformed by an advanced species in order to fit their needs.' },

    // Life
    { trait: 'Biotic', category: 'Life', description: 'Some life present - microbial or sparse fauna/flora, no sentient life unless Sapient is also set.' },
    { trait: 'Verdant', category: 'Life', description: 'Abundant, thriving biosphere - rich ecosystems, no sentient life unless Sapient is also set.' },
    { trait: 'Sapient', category: 'Life', description: 'Sentient life exists - can combine with either Biotic or Verdant, or neither (i.e. a civilization that stripped its planet bare).' },
    { trait: 'Advanced Sapient', category: 'Life', description: 'Sentient life with FTL space travel exists - can combine with Biotic or Verdant, or neither (i.e. a civilization that stripped its planet bare).' },

    // Magnetic
    { trait: 'Magnetar', category: 'Magnetic', description: 'Abnormally powerful magnetic field - disrupts electronics, traps radiation belts.' },
    { trait: 'Demagnetized', category: 'Magnetic', description: 'No magnetic field whatsoever - surface fully exposed to stellar winds and radiation.' },

    // Exotic
    { trait: 'Psionic', category: 'Exotic', description: 'Home to a life form with telepathic powers - requires Verdant, Sapient, or Advanced Sapient trait.' },
    { trait: 'Liminal', category: 'Exotic', description: 'Space-time portals naturally occur on this planet.' },
    { trait: 'Chronal', category: 'Exotic', description: "Time flows vastly differently here than this planet's mass predicts." },
    { trait: 'Living', category: 'Exotic', description: 'This planet itself is a living organism - an extraordinarily massive connected system of living organic tissue, with its core serving as something analogous to a brain.' },
    { trait: 'Inverted', category: 'Exotic', description: 'This planet is hollow. The outer crust is barren, but the interior is vastly different - gravity flows toward the crust rather than the core.' },
    { trait: 'Ghostly', category: 'Exotic', description: 'This planet is out of phase with the rest of the universe. It appears translucent, and objects pass through it with some resistance but make no physical contact.' },
    { trait: 'Xenolithic', category: 'Exotic', description: 'This planet consists of an exotic material that makes up over 99% of its crust and mantle.' },
    { trait: 'Prismatic', category: 'Exotic', description: 'The atmosphere splits light into perpetual full-spectrum refraction - the sky is a constant rainbow.' },
    { trait: 'Resonant', category: 'Exotic', description: 'Gravitationally locked in precise orbital resonance with multiple bodies, causing unusual tidal forces.' },
    { trait: 'Negated', category: 'Exotic', description: 'Gravity behaves anomalously here - it weakens or reverses unpredictably at certain altitudes or regions.' },
    { trait: 'Acoustic', category: 'Exotic', description: 'Sound propagates in physically impossible ways here - across vacuum, through solid rock, or not at all.' },
    { trait: 'Artificial', category: 'Exotic', description: 'This planet, rather than having formed naturally, has been artificially constructed by an advanced group of lifeforms.' },
];

const planetClasses: FullClass[] = [
    { class: 'Rocky', description: 'A world of silicate rock and mineral deposits. These terrestrial planets form in the inner regions of solar systems where heat prevents lighter gases from condensing. Surfaces range from barren cratered wastes to geologically active worlds with mountains, canyons, and valleys. Iron-nickel cores may generate magnetic fields where the outer core remains molten and convecting. Dense enough atmospheres may form from outgassing.' },
    { class: 'Gas Giant', description: 'A colossus of gasses such as hydrogen and helium with no solid surface. These planetary titans form beyond the frost line where volatile compounds remained frozen, allowing massive cores to accrete enormous atmospheric envelopes. Interiors transition from gas to liquid to metallic hydrogen under crushing pressures. Their storms can persist for centuries.' },
    { class: 'Ice Giant', description: 'Unlike true gas giants, these worlds contain large quantities of water, ammonia, and methane ices surrounding a rocky and metallic core, though the boundary between core and mantle may be gradual rather than distinct. Their "ices" exist in a hot, dense fluid state under extreme pressure. Distinctive blue-green hues come from methane gas absorbing red light. Their magnetic fields are often tilted dramatically off-axis.' },
    { class: 'Oceanic', description: 'A world entirely covered by liquid water to depths that dwarf any ocean in the known galaxy. Some have thin ice crusts over global oceans; others are warm, endless seas beneath open skies. The pressure at extreme depths can force water into exotic high-pressure ice phases even at elevated temperatures.' },
    { class: 'Chthonian', description: 'The scorched skeleton of a former gas giant. When a massive planet migrates too close to its star, intense radiation and stellar winds strip away its hydrogen and helium envelope over millions of years, leaving behind only the dense rocky or metallic core. Chthonian planets are extremely hot, typically tidally locked, and largely or entirely airless - planetary corpses orbiting in the heat they could not escape.' },
    { class: 'Sub-Neptune', description: 'The most common class of planet in observed galaxies, yet absent from our own solar system. Sub-Neptunes fall between rocky super-Earths and ice giants in size, with radii roughly 1.7 to 3.5 times that of Earth. Their compositions are poorly constrained - some are thought to be rocky cores with thick hydrogen-helium envelopes; others may be volatile-rich "water worlds" with deep fluid layers. A notable scarcity of planets around 1.7 Earth radii - the radius gap - suggests atmospheric loss gradually converts some sub-Neptunes into super-Earths over time.' },
    { class: 'Mechanical', description: 'A machine world with every square meter covered in interconnected machinery and circuitry. Likely built by an advanced cybernetic sentient race or a highly advanced organic species.' },
]

export function getTrait(category: TraitCategory | 'Random'): FullTrait {
    if (category === 'Random') {
        return planetTraits[Math.floor(Math.random() * planetTraits.length)];
    } else {
        return planetTraits.find(t => t.category === category)!;
    }
}

function randomClass(): FullClass {
    const weighted = [
        { class: 'Sub-Neptune', weight: 35   },
        { class: 'Rocky',       weight: 30   },
        { class: 'Gas Giant',   weight: 15   },
        { class: 'Ice Giant',   weight: 12   },
        { class: 'Oceanic',     weight: 5    },
        { class: 'Chthonian',   weight: 3    },
        { class: 'Mechanical',  weight: 0.01 },
    ];

    const total = weighted.reduce((sum, e) => sum + e.weight, 0);
    const roll = Math.random() * total;

    let cursor = 0;
    for (const entry of weighted) {
        cursor += entry.weight;
        if (roll < cursor) {
            return planetClasses.find(p => p.class === entry.class)!;
        }
    }

    // Fallback - should never be reached
    return planetClasses[0];
}

function generateId(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // omit ambiguous chars like 0/O, 1/I
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function randBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

function roll(chance: number): boolean {
    return Math.random() < chance;
}

function pickTrait(name: string): FullTrait {
    return planetTraits.find(t => t.trait === name)!;
}

function generateTraits(planetClass: PlanetClass): FullTrait[] {
    const traits: FullTrait[] = [];
    const add = (name: string) => traits.push(pickTrait(name));
    const has = (name: string) => traits.some(t => t.trait === name);

    const isGaseous  = ['Gas Giant', 'Ice Giant', 'Sub-Neptune'].includes(planetClass);
    const isSolid    = ['Rocky', 'Chthonian', 'Mechanical'].includes(planetClass);

    // SIZE - Dwarf and Super are mutually exclusive
    const [dwarfChance, superChance] = ({
        'Rocky':       [0.15, 0.10],
        'Gas Giant':   [0.05, 0.18],
        'Ice Giant':   [0.08, 0.12],
        'Oceanic':     [0.10, 0.10],
        'Chthonian':   [0.05, 0.15],
        'Sub-Neptune': [0.12, 0.10],
        'Mechanical':  [0.00, 0.00],
    } as Record<string, [number, number]>)[planetClass] ?? [0, 0];

    const sizeRoll = Math.random();
    if      (sizeRoll < dwarfChance)               add('Dwarf');
    else if (sizeRoll < dwarfChance + superChance)  add('Super');

    // ORBITAL - Rogue excludes all star-dependent traits
    const isRogue = planetClass !== 'Mechanical' && roll(0.04);
    if (isRogue) {
        add('Rogue');
    } else {
        // Eccentric and Tidally Locked are mutually exclusive - tidal locking requires a near-circular orbit
        const isEccentric     = roll(planetClass === 'Chthonian' ? 0.03 : 0.08);
        const isTidallyLocked = !isEccentric && roll(planetClass === 'Chthonian' ? 0.85 : 0.10);
        if (isEccentric)     add('Eccentric');
        if (isTidallyLocked) add('Tidally Locked');
        if (roll(0.03))      add('Trojan');
    }

    // SURFACE & GEOLOGY - solid, non-Mechanical worlds only
    if (isSolid && planetClass !== 'Mechanical') {
    const surfaceChances: Partial<Record<PlanetClass, Record<string, number>>> = {
            'Rocky':     { Volcanic: 0.25, Ferrian: 0.15, Glacial: 0.15, Cratered: 0.30, Tectonic: 0.15, Crystalline: 0.05, Cavernous: 0.10 },
            'Chthonian': { Cratered: 0.70, Ferrian: 0.50, Volcanic: 0.20 },
        };
        for (const [trait, chance] of Object.entries(surfaceChances[planetClass] ?? {} as Record<string, number>)) {
            if (roll(chance)) add(trait);
        }
    }
    if (planetClass === 'Oceanic' && roll(0.25)) add('Glacial'); // ice crust variant

    // ATMOSPHERE
    switch (planetClass) {
        case 'Chthonian':
            if (roll(0.50)) add('Thin');
            if (roll(0.65)) add('Irradiated'); // stripped cores orbit close to their star
            break;
        case 'Gas Giant':
            if (roll(0.55)) add('Tempestuous');
            if (roll(0.25)) add('Venusian');
            break;
        case 'Mechanical':
            break; // controlled atmosphere - no random traits
        default: {
            // Thin is mutually exclusive with dense atmosphere traits
            const thinAtmo = !isGaseous && roll(planetClass === 'Rocky' ? 0.18 : 0.06);
            if (thinAtmo) {
                add('Thin');
            } else {
                if (roll(0.10)) add('Venusian');
                if (roll(0.12)) add('Toxic');
                if (roll(0.08)) add('Tempestuous');
            }
            if (!isRogue && !has('Tidally Locked') && roll(0.08)) add('Irradiated');
        }
    }

    // HABITABILITY - Desert, Habitable, and Terraformed are mutually exclusive
    const hostile = isRogue || isGaseous || planetClass === 'Chthonian'
        || has('Thin') || has('Toxic') || has('Venusian') || has('Irradiated');

    if (planetClass === 'Mechanical') {
        if (roll(0.55)) add('Terraformed');
    } else if (!hostile) {
        const hRoll = Math.random();
        if      (hRoll < 0.22) add('Habitable');
        else if (hRoll < 0.45) add('Desert');
    } else if (!isGaseous && !isRogue && planetClass !== 'Chthonian') {
        if (roll(0.25)) add('Desert'); // hostile worlds can still be desert-classified
    }

    // LIFE
    const canHaveLife = has('Habitable') || has('Terraformed') || (planetClass === 'Oceanic' && !isRogue);

    if (planetClass === 'Mechanical') {
        add('Advanced Sapient'); // machine worlds always have their builders
        if (roll(0.40)) add('Verdant');
    } else if (canHaveLife) {
        const lifeRoll = Math.random();
        const biomeTrait = lifeRoll < 0.30 ? 'Biotic' : lifeRoll < 0.55 ? 'Verdant' : null;
        if (biomeTrait) {
            add(biomeTrait);
            // Sapient and Advanced Sapient are mutually exclusive
            const sapRoll = Math.random();
            if      (sapRoll < 0.08) add('Advanced Sapient');
            else if (sapRoll < 0.22) add('Sapient');
        }
    }

    // MAGNETIC - Magnetar and Demagnetized are mutually exclusive
    const magRoll = Math.random();
    if      (magRoll < 0.07) add('Magnetar');
    else if (magRoll < 0.18) add('Demagnetized');

    // EXOTIC - 0.125% each; some require preconditions
    const hasLifeTrait = has('Verdant') || has('Sapient') || has('Advanced Sapient');
    const exotics: { name: string; valid: boolean }[] = [
        { name: 'Psionic',    valid: hasLifeTrait },
        { name: 'Liminal',    valid: true },
        { name: 'Chronal',    valid: true },
        { name: 'Living',     valid: planetClass !== 'Mechanical' },
        { name: 'Inverted',   valid: !isGaseous && planetClass !== 'Oceanic' },
        { name: 'Ghostly',    valid: true },
        { name: 'Xenolithic', valid: true },
        { name: 'Prismatic',  valid: !has('Thin') },
        { name: 'Resonant',   valid: true },
        { name: 'Negated',    valid: true },
        { name: 'Acoustic',   valid: true },
        { name: 'Artificial', valid: true },
    ];
    for (const exotic of exotics) {
        if (exotic.valid && roll(0.00125)) add(exotic.name);
    }

    return traits;
}


function generatePhysicals(planetClass: PlanetClass, traits: FullTrait[]) {
    const isDwarf         = traits.some(t => t.trait === 'Dwarf');
    const isSuper         = traits.some(t => t.trait === 'Super');
    const isTidallyLocked = traits.some(t => t.trait === 'Tidally Locked');

    type Range = [number, number];
    type ClassRanges = { mass: Range; diameter: Range; density: Range; rotation: Range };

    //                   mass (Earth=1)      diameter (km)               density (g/cm³)      rotation (hrs)
    const ranges: Record<string, ClassRanges> = {
        'Rocky':       { mass: [0.05, 2],    diameter: [4000,   14000],  density: [3.5, 8.0], rotation: [8,   1000] },
        'Gas Giant':   { mass: [50,   500],  diameter: [70000,  160000], density: [0.3, 2.5], rotation: [8,   30]   },
        'Ice Giant':   { mass: [10,   60],   diameter: [25000,  60000],  density: [1.0, 2.5], rotation: [12,  40]   },
        'Oceanic':     { mass: [0.5,  5],    diameter: [8000,   18000],  density: [1.5, 4.0], rotation: [12,  500]  },
        'Chthonian':   { mass: [5,    60],   diameter: [15000,  55000],  density: [3.0, 8.0], rotation: [500, 8000] },
        'Sub-Neptune': { mass: [2,    20],   diameter: [12000,  28000],  density: [1.0, 4.0], rotation: [12,  200]  },
        'Mechanical':  { mass: [0.5,  5],    diameter: [8000,   16000],  density: [4.0, 9.0], rotation: [20,  100]  },
    };

    const r = ranges[planetClass] ?? ranges['Rocky'];
    const massScale     = isDwarf ? 0.1  : isSuper ? 4.0 : 1;
    const diameterScale = isDwarf ? 0.55 : isSuper ? 1.8 : 1;

    return {
        mass:             parseFloat((randBetween(r.mass[0],     r.mass[1])     * massScale    ).toFixed(3)),
        diameter:         Math.round( randBetween(r.diameter[0], r.diameter[1]) * diameterScale),
        density:          parseFloat( randBetween(r.density[0],  r.density[1])                 .toFixed(2)),
        rotational_speed: parseFloat((isTidallyLocked
                ? randBetween(2000, 50000)
                : randBetween(r.rotation[0], r.rotation[1])
        ).toFixed(1)),
    };
}

export function generatePlanet(): Planet {
    const planetClass = randomClass();
    const traits      = generateTraits(planetClass.class);
    const physicals   = generatePhysicals(planetClass.class, traits);

    return {
        id:     generateId(),
        class:  planetClass.class,
        traits: traits.map(t => t.trait),
        ...physicals,
    };
}
