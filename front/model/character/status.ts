// 기본 상태 정보 (equipment.ts에서 가져온 것과 동일)
export interface Status {
    name: string;
    value: string | number;
}

// 버프 정보
export interface Buff {
    name: string;
    level?: number;
    status: Status[];
}

// 캐릭터 능력치 전체 응답
export interface CharacterStatusResponse {
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
    buff: Buff[];
    status: Status[];
}

// 능력치 카테고리 상수
export const STATUS_CATEGORIES = {
    // 기본 능력치
    BASIC: {
        HP: 'HP',
        MP: 'MP',
        STRENGTH: '힘',
        INTELLIGENCE: '지능',
        VITALITY: '체력',
        SPIRIT: '정신력'
    },

    // 공격 관련
    ATTACK: {
        PHYSICAL_ATTACK: '물리 공격',
        MAGIC_ATTACK: '마법 공격',
        INDEPENDENT_ATTACK: '독립 공격',
        PHYSICAL_CRITICAL: '물리 크리티컬',
        MAGIC_CRITICAL: '마법 크리티컬',
        ATTACK_POWER_INCREASE: '공격력 증가',
        ATTACK_POWER_AMPLIFICATION: '공격력 증폭'
    },

    // 방어 관련
    DEFENSE: {
        PHYSICAL_DEFENSE: '물리 방어',
        MAGIC_DEFENSE: '마법 방어',
        PHYSICAL_DEFENSE_RATE: '물리 방어율',
        MAGIC_DEFENSE_RATE: '마법 방어율',
        PHYSICAL_DAMAGE_REDUCTION: '물리 피해 감소',
        MAGIC_DAMAGE_REDUCTION: '마법 피해 감소'
    },

    // 속도 관련
    SPEED: {
        ATTACK_SPEED: '공격 속도',
        CASTING_SPEED: '캐스팅 속도',
        MOVEMENT_SPEED: '이동 속도'
    },

    // 속성 강화
    ELEMENT_ENHANCEMENT: {
        FIRE_ENHANCEMENT: '화속성 강화',
        WATER_ENHANCEMENT: '수속성 강화',
        LIGHT_ENHANCEMENT: '명속성 강화',
        DARK_ENHANCEMENT: '암속성 강화'
    },

    // 속성 저항
    ELEMENT_RESISTANCE: {
        FIRE_RESISTANCE: '화속성 저항',
        WATER_RESISTANCE: '수속성 저항',
        LIGHT_RESISTANCE: '명속성 저항',
        DARK_RESISTANCE: '암속성 저항'
    },

    // 속성 피해
    ELEMENT_DAMAGE: {
        FIRE_DAMAGE: '화속성 피해',
        WATER_DAMAGE: '수속성 피해',
        LIGHT_DAMAGE: '명속성 피해',
        DARK_DAMAGE: '암속성 피해'
    },

    // 상태이상 관련
    STATUS_AILMENT: {
        BLEEDING_DAMAGE: '출혈 피해',
        POISON_DAMAGE: '중독 피해',
        BURN_DAMAGE: '화상 피해',
        SHOCK_DAMAGE: '감전 피해',
        BLEEDING_RESISTANCE: '출혈 내성',
        POISON_RESISTANCE: '중독 내성',
        BURN_RESISTANCE: '화상 내성',
        SHOCK_RESISTANCE: '감전 내성',
        FREEZE_RESISTANCE: '빙결 내성',
        SLOW_RESISTANCE: '둔화 내성',
        STUN_RESISTANCE: '기절 내성',
        CURSE_RESISTANCE: '저주 내성',
        DARKNESS_RESISTANCE: '암흑 내성',
        PETRIFY_RESISTANCE: '석화 내성',
        SLEEP_RESISTANCE: '수면 내성',
        CONFUSION_RESISTANCE: '혼란 내성',
        BIND_RESISTANCE: '구속 내성'
    },

    // 기타
    MISC: {
        HIT_RATE: '적중률',
        DODGE_RATE: '회피율',
        HP_RECOVERY: 'HP 회복량',
        MP_RECOVERY: 'MP 회복량',
        STIFFNESS: '경직도',
        HIT_RECOVERY: '히트리커버리',
        FAME: '모험가 명성',
        BUFF_POWER: '버프력',
        BUFF_POWER_AMPLIFICATION: '버프력 증폭',
        FINAL_DAMAGE_INCREASE: '최종 데미지 증가',
        COOLDOWN_REDUCTION: '쿨타임 감소',
        COOLDOWN_RECOVERY_SPEED: '쿨타임 회복속도',
        FINAL_COOLDOWN_REDUCTION_RATE: '최종 쿨타임 감소율'
    }
} as const;

// 버프 타입 상수
export const BUFF_TYPES = {
    ADVENTURE_BUFF: '모험단 버프',
    UNLIMITED_GUILD_BUFF: '무제한 길드능력치',
    TEMPORARY_GUILD_BUFF: '기간제 길드능력치'
} as const;

export type BuffType = typeof BUFF_TYPES[keyof typeof BUFF_TYPES];

// 캐릭터 능력치 분석 클래스
export class CharacterStatusAnalyzer {
    private statusResponse: CharacterStatusResponse;

    constructor(statusResponse: CharacterStatusResponse) {
        this.statusResponse = statusResponse;
    }

    // 특정 능력치 값 가져오기
    getStatusValue(statusName: string): number {
        const status = this.statusResponse.status.find(s => s.name === statusName);
        if (!status) return 0;

        const value = typeof status.value === 'string'
            ? parseFloat(status.value.replace(/[^\d.-]/g, ''))
            : status.value;

        return isNaN(value) ? 0 : value;
    }

    // 기본 능력치 가져오기
    getBasicStats() {
        return {
            hp: this.getStatusValue(STATUS_CATEGORIES.BASIC.HP),
            mp: this.getStatusValue(STATUS_CATEGORIES.BASIC.MP),
            strength: this.getStatusValue(STATUS_CATEGORIES.BASIC.STRENGTH),
            intelligence: this.getStatusValue(STATUS_CATEGORIES.BASIC.INTELLIGENCE),
            vitality: this.getStatusValue(STATUS_CATEGORIES.BASIC.VITALITY),
            spirit: this.getStatusValue(STATUS_CATEGORIES.BASIC.SPIRIT)
        };
    }

    // 공격 능력치 가져오기
    getAttackStats() {
        return {
            physicalAttack: this.getStatusValue(STATUS_CATEGORIES.ATTACK.PHYSICAL_ATTACK),
            magicAttack: this.getStatusValue(STATUS_CATEGORIES.ATTACK.MAGIC_ATTACK),
            independentAttack: this.getStatusValue(STATUS_CATEGORIES.ATTACK.INDEPENDENT_ATTACK),
            physicalCritical: this.getStatusValue(STATUS_CATEGORIES.ATTACK.PHYSICAL_CRITICAL),
            magicCritical: this.getStatusValue(STATUS_CATEGORIES.ATTACK.MAGIC_CRITICAL),
            attackPowerIncrease: this.getStatusValue(STATUS_CATEGORIES.ATTACK.ATTACK_POWER_INCREASE),
            attackPowerAmplification: this.getStatusValue(STATUS_CATEGORIES.ATTACK.ATTACK_POWER_AMPLIFICATION)
        };
    }

    // 방어 능력치 가져오기
    getDefenseStats() {
        return {
            physicalDefense: this.getStatusValue(STATUS_CATEGORIES.DEFENSE.PHYSICAL_DEFENSE),
            magicDefense: this.getStatusValue(STATUS_CATEGORIES.DEFENSE.MAGIC_DEFENSE),
            physicalDefenseRate: this.getStatusValue(STATUS_CATEGORIES.DEFENSE.PHYSICAL_DEFENSE_RATE),
            magicDefenseRate: this.getStatusValue(STATUS_CATEGORIES.DEFENSE.MAGIC_DEFENSE_RATE),
            physicalDamageReduction: this.getStatusValue(STATUS_CATEGORIES.DEFENSE.PHYSICAL_DAMAGE_REDUCTION),
            magicDamageReduction: this.getStatusValue(STATUS_CATEGORIES.DEFENSE.MAGIC_DAMAGE_REDUCTION)
        };
    }

    // 속성 강화 가져오기
    getElementEnhancements() {
        return {
            fire: this.getStatusValue(STATUS_CATEGORIES.ELEMENT_ENHANCEMENT.FIRE_ENHANCEMENT),
            water: this.getStatusValue(STATUS_CATEGORIES.ELEMENT_ENHANCEMENT.WATER_ENHANCEMENT),
            light: this.getStatusValue(STATUS_CATEGORIES.ELEMENT_ENHANCEMENT.LIGHT_ENHANCEMENT),
            dark: this.getStatusValue(STATUS_CATEGORIES.ELEMENT_ENHANCEMENT.DARK_ENHANCEMENT)
        };
    }

    // 최고 속성 강화 찾기
    getHighestElementEnhancement(): { element: string; value: number } {
        const enhancements = this.getElementEnhancements();
        let highest = { element: 'fire', value: enhancements.fire };

        Object.entries(enhancements).forEach(([element, value]) => {
            if (value > highest.value) {
                highest = { element, value };
            }
        });

        return highest;
    }

    // 속도 능력치 가져오기
    getSpeedStats() {
        return {
            attackSpeed: this.getStatusValue(STATUS_CATEGORIES.SPEED.ATTACK_SPEED),
            castingSpeed: this.getStatusValue(STATUS_CATEGORIES.SPEED.CASTING_SPEED),
            movementSpeed: this.getStatusValue(STATUS_CATEGORIES.SPEED.MOVEMENT_SPEED)
        };
    }

    // 버프 정보 분석
    getBuffAnalysis() {
        const adventureBuff = this.statusResponse.buff.find(b => b.name === BUFF_TYPES.ADVENTURE_BUFF);
        const unlimitedGuildBuff = this.statusResponse.buff.find(b => b.name === BUFF_TYPES.UNLIMITED_GUILD_BUFF);
        const temporaryGuildBuff = this.statusResponse.buff.find(b => b.name === BUFF_TYPES.TEMPORARY_GUILD_BUFF);

        return {
            adventureBuff: {
                level: adventureBuff?.level || 0,
                stats: adventureBuff?.status || []
            },
            unlimitedGuildBuff: {
                stats: unlimitedGuildBuff?.status || []
            },
            temporaryGuildBuff: {
                stats: temporaryGuildBuff?.status || []
            }
        };
    }

    // 총 버프 능력치 계산
    getTotalBuffStats(): { [key: string]: number } {
        const totalBuffStats: { [key: string]: number } = {};

        this.statusResponse.buff.forEach(buff => {
            buff.status.forEach(status => {
                const value = typeof status.value === 'string'
                    ? parseFloat(status.value.replace(/[^\d.-]/g, ''))
                    : status.value;

                if (!isNaN(value)) {
                    totalBuffStats[status.name] = (totalBuffStats[status.name] || 0) + value;
                }
            });
        });

        return totalBuffStats;
    }

    // 캐릭터 전투력 추정 (간단한 계산)
    getEstimatedPower(): number {
        const basic = this.getBasicStats();
        const attack = this.getAttackStats();
        const elementEnhancement = this.getHighestElementEnhancement();

        // 단순한 전투력 계산 공식 (실제와는 다를 수 있음)
        const basePower = basic.strength + basic.intelligence + basic.vitality + basic.spirit;
        const attackPower = attack.physicalAttack + attack.magicAttack + attack.independentAttack;
        const elementPower = elementEnhancement.value;

        return Math.floor((basePower * 0.3) + (attackPower * 0.5) + (elementPower * 0.2));
    }

    // 캐릭터 정보 요약
    getSummary() {
        return {
            characterInfo: {
                name: this.statusResponse.characterName,
                level: this.statusResponse.level,
                job: this.statusResponse.jobName,
                jobGrow: this.statusResponse.jobGrowName,
                fame: this.statusResponse.fame,
                adventureName: this.statusResponse.adventureName,
                guildName: this.statusResponse.guildName
            },
            basicStats: this.getBasicStats(),
            attackStats: this.getAttackStats(),
            defenseStats: this.getDefenseStats(),
            speedStats: this.getSpeedStats(),
            elementEnhancements: this.getElementEnhancements(),
            highestElement: this.getHighestElementEnhancement(),
            buffAnalysis: this.getBuffAnalysis(),
            estimatedPower: this.getEstimatedPower()
        };
    }
}

// 유틸리티 함수들
export class StatusUtils {
    // 퍼센트 값인지 확인
    static isPercentageValue(statusName: string): boolean {
        const percentageStats = [
            '물리 방어율', '마법 방어율', '물리 크리티컬', '마법 크리티컬',
            '적중률', '회피율', '쿨타임 감소', '최종 쿨타임 감소율'
        ];

        return percentageStats.includes(statusName);
    }

    // 능력치 값을 적절한 형태로 포맷팅
    static formatStatusValue(statusName: string, value: number): string {
        if (this.isPercentageValue(statusName)) {
            return `${value.toFixed(1)}%`;
        }

        // 큰 숫자는 천 단위로 콤마 추가
        if (value >= 1000) {
            return value.toLocaleString();
        }

        return value.toString();
    }

    // 속성 강화 색상 가져오기
    static getElementColor(elementName: string): string {
        switch (elementName) {
            case 'fire': return '#ff4444';
            case 'water': return '#4488ff';
            case 'light': return '#ffdd44';
            case 'dark': return '#8844ff';
            default: return '#666666';
        }
    }
}