// 기본 상태 정보
export interface Status {
    name: string;
    value: string | number;
}

// 스킨 정보
export interface Skin {
    itemId: string;
    itemName: string;
    itemRarity: string;
}

// 인챈트 정보
export interface Enchant {
    status: Status[];
}

// 튠 정보
export interface Tune {
    level?: number;
    upgrade?: boolean;
    status?: Status[];
    name?: string;
    setPoint?: number;
}

// 융합 옵션
export interface FusionOption {
    options: {
        buff: number;
        explain: string;
        explainDetail: string;
        buffExplain: string;
        buffExplainDetail: string;
    }[];
}

// 업그레이드 정보
export interface UpgradeInfo {
    itemId: string;
    itemName: string;
    itemRarity: string;
}

// 장비 아이템 정보
export interface Equipment {
    slotId: string;
    slotName: string;
    itemId: string;
    itemName: string;
    itemTypeId: string;
    itemType: string;
    itemTypeDetailId: string;
    itemTypeDetail: string;
    itemAvailableLevel: number;
    itemRarity: string;
    setItemId: string | null;
    setItemName: string | null;
    skin?: Skin;
    reinforce: number;
    itemGradeName?: string;
    enchant?: Enchant;
    amplificationName: string | null;
    refine: number;
    engraveName?: boolean;
    tune?: Tune[];
    fusionOption?: FusionOption;
    upgradeInfo?: UpgradeInfo;
}

// 캐릭터 장착장비 전체 응답
export interface CharacterEquipmentResponse {
    serverId: string;
    characterId: string;
    characterName: string;
    level: number;
    jobId: string;
    jobGrowId: string;
    jobName: string;
    jobGrowName: string;
    fame: number;
    adventureName: string;
    guildId: string;
    guildName: string;
    equipment: Equipment[];
}

// 장비 슬롯 타입 (상수)
export const EQUIPMENT_SLOTS = {
    WEAPON: 'WEAPON',
    TITLE: 'TITLE',
    JACKET: 'JACKET',
    SHOULDER: 'SHOULDER',
    PANTS: 'PANTS',
    SHOES: 'SHOES',
    WAIST: 'WAIST',
    AMULET: 'AMULET',
    WRIST: 'WRIST',
    RING: 'RING',
    SUPPORT: 'SUPPORT',
    MAGIC_STONE: 'MAGIC_STONE',
    EARRING: 'EARRING'
} as const;

export type EquipmentSlotType = typeof EQUIPMENT_SLOTS[keyof typeof EQUIPMENT_SLOTS];

// 아이템 등급 타입
export const ITEM_RARITIES = {
    COMMON: '커먼',
    UNCOMMON: '언커먼',
    RARE: '레어',
    UNIQUE: '유니크',
    EPIC: '에픽',
    LEGENDARY: '레전더리',
    MYTHIC: '신화',
    PRIMORDIAL: '태초'
} as const;

export type ItemRarityType = typeof ITEM_RARITIES[keyof typeof ITEM_RARITIES];

// 증폭 타입
export const AMPLIFICATION_TYPES = {
    DIMENSIONAL_POWER: '차원의 힘',
    BAKAL_POWER: '바칼의 힘',
    // 필요에 따라 추가
} as const;

export type AmplificationType = typeof AMPLIFICATION_TYPES[keyof typeof AMPLIFICATION_TYPES];

// 유틸리티 함수들
export class EquipmentUtils {
    // 특정 슬롯의 장비 찾기
    static findEquipmentBySlot(equipment: Equipment[], slotId: string): Equipment | undefined {
        return equipment.find(item => item.slotId === slotId);
    }

    // 세트 아이템 개수 계산
    static countSetItems(equipment: Equipment[], setItemId: string): number {
        return equipment.filter(item => item.setItemId === setItemId).length;
    }

    // 총 강화 수치 계산
    static getTotalReinforcement(equipment: Equipment[]): number {
        return equipment.reduce((total, item) => total + item.reinforce, 0);
    }

    // 증폭된 장비 개수
    static getAmplifiedCount(equipment: Equipment[]): number {
        return equipment.filter(item => item.amplificationName !== null).length;
    }

    // 특정 등급의 장비 개수
    static countByRarity(equipment: Equipment[], rarity: string): number {
        return equipment.filter(item => item.itemRarity === rarity).length;
    }

    // 융합 옵션이 있는 장비 필터링
    static getEquipmentWithFusion(equipment: Equipment[]): Equipment[] {
        return equipment.filter(item => item.fusionOption !== undefined);
    }

    // 튜닝된 장비 필터링
    static getTunedEquipment(equipment: Equipment[]): Equipment[] {
        return equipment.filter(item => item.tune && item.tune.length > 0);
    }

    // 인챈트 상태 값 추출
    static getEnchantValue(equipment: Equipment, statusName: string): number {
        if (!equipment.enchant?.status) return 0;

        const status = equipment.enchant.status.find(s => s.name === statusName);
        if (!status) return 0;

        // 문자열에서 숫자 추출 (예: "5%" -> 5, "100" -> 100)
        const value = typeof status.value === 'string'
            ? parseFloat(status.value.replace(/[^\d.-]/g, ''))
            : status.value;

        return isNaN(value) ? 0 : value;
    }
}

// 장비 세트 정보 인터페이스
export interface EquipmentSet {
    setItemId: string;
    setItemName: string;
    count: number;
    items: Equipment[];
}

// 세트 아이템 관리 클래스
export class SetItemManager {
    static getSetItems(equipment: Equipment[]): EquipmentSet[] {
        const setMap = new Map<string, Equipment[]>();

        equipment.forEach(item => {
            if (item.setItemId) {
                if (!setMap.has(item.setItemId)) {
                    setMap.set(item.setItemId, []);
                }
                setMap.get(item.setItemId)!.push(item);
            }
        });

        return Array.from(setMap.entries()).map(([setItemId, items]) => ({
            setItemId,
            setItemName: items[0].setItemName || '',
            count: items.length,
            items
        }));
    }
}