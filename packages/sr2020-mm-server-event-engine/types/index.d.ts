export interface SpellCast {
    timestamp: number;
    id: string;
    name: string;
    characterId: string;
    location: {
        id: number;
    };
    power: number;
    ritualMembersIds: string[];
    ritualVictimIds: string[];
}
