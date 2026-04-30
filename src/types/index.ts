export type PlanetClass =
    | 'Rocky'
    | 'GasGiant'
    | 'IceGiant'
    | 'Oceanic'
    | 'Chthonian'
    | 'SubNeptune'
    | 'Mechanical';

export type PlanetTrait =
    | 'Dwarf' | 'Super'
    | 'Volcanic' | 'Ferrian' | 'Glacial' | 'Cratered' | 'Tectonic' | 'Crystalline' | 'Cavernous'
    | 'Rogue' | 'Eccentric' | 'TidallyLocked' | 'Trojan'
    | 'Venusian' | 'Toxic' | 'Irradiated' | 'Tempestuous' | 'Thin'
    | 'Desert' | 'Habitable'
    | 'Biotic' | 'Verdant' | 'Sapient' | 'AdvancedSapient'
    | 'Magnetar' | 'Demagnetized'
    | 'Psionic' | 'Liminal' | 'Chronal' | 'Living' | 'Inverted' | 'Ghostly'
    | 'Xenolithic' | 'Prismatic' | 'Resonant' | 'Negated' | 'Acoustic' | 'Artificial';

export type Planet = {
    id: string,
    class: PlanetClass,
    traits: PlanetTrait[],
    mass: number,
    density: number,
    diameter: number,
    rotational_speed: number,
}