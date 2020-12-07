import { Player } from "./player"

export type SantaTeamType = {
    ATT1: Player,
    ATT2: Player,
    DEF: Player
}
export type KrampusTeamType = {
    ATT1: Player,
    ATT2: Player,
    DEF: Player
}

export enum TeamType {
    SANTA,
    KRAMPUS
}

export enum RoleType {
    ATT1,
    ATT2,
    DEF
}