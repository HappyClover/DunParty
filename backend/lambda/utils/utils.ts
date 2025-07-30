import {CharacterStats} from "../character/character.types";


export function calculateExpectedDamage(
    stats: CharacterStats,
    skillCoef: number = 4000,
    attackType: 'physical' | 'magic' | 'independent' = 'physical'
): number {
    const {
        str,
        int,
        physicalAttack,
        magicAttack,
        independentAttack,
        elementEnhance,
        attackIncrease,
        finalDamageIncrease,
    } = stats;

    // 1) 스탯 계수
    const statFactor = (str + int) / 250 + 1;

    // 2) 기본 공격력 선택
    const baseAttack =
        attackType === 'physical'
            ? physicalAttack
            : attackType === 'magic'
                ? magicAttack
                : independentAttack;

    // 3) 속성 강화 계수
    const elementFactor = 1.05 + 0.0045 * elementEnhance;

    // 4) 공격력 증가 계수
    const attackIncreaseFactor = attackIncrease / 1000;

    // 5) 최종 데미지 증가 계수
    const finalDamageFactor = 1 + finalDamageIncrease / 100;

    // 6) 최종 계산
    return (
        statFactor *
        baseAttack *
        elementFactor *
        attackIncreaseFactor *
        finalDamageFactor *
        skillCoef
    );
}