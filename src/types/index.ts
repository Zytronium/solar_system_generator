export type PlanetClass =
    | 'Rocky'
    | 'Gas Giant'
    | 'Ice Giant'
    | 'Oceanic'
    | 'Chthonian'
    | 'Sub-Neptune'
    | 'Mechanical';

export type PlanetTrait =
    | 'Dwarf' | 'Super'
    | 'Volcanic' | 'Ferrian' | 'Glacial' | 'Cratered' | 'Tectonic' | 'Crystalline' | 'Cavernous'
    | 'Rogue' | 'Eccentric' | 'Tidally Locked' | 'Trojan'
    | 'Venusian' | 'Toxic' | 'Irradiated' | 'Tempestuous' | 'Thin'
    | 'Desert' | 'Habitable' | 'Terraformed'
    | 'Biotic' | 'Verdant' | 'Sapient' | 'Advanced Sapient'
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