import { PARTY_COLORS, PARTY_COLOR_NAMES, PARTY_COLOR_ORDER, type PartyColor } from '../colors';

class ColorUtils {
    // 파티 색상 이름 가져오기
    getPartyColorName(color: PartyColor): string {
        return PARTY_COLOR_NAMES[color] || '일반 파티';
    }

    // 인덱스로 파티 색상 가져오기 (순서대로 할당)
    getPartyColorByIndex(index: number): PartyColor {
        return PARTY_COLOR_ORDER[index % PARTY_COLOR_ORDER.length];
    }

    // 파티 타입에 따른 기본 색상 가져오기
    getPartyTypeColor(type: 'normal' | 'raid8' | 'raid12' | 'raid16'): string {
        switch (type) {
            case 'normal':
                return 'red';
            case 'raid8':
                return 'yellow';
            case 'raid12':
                return 'green';
            case 'raid16':
                return 'orange';
            default:
                return 'gray';
        }
    }

    // 파티 타입 라벨 가져오기
    getPartyTypeLabel(type: 'normal' | 'raid8' | 'raid12' | 'raid16'): string {
        switch (type) {
            case 'normal':
                return '일반';
            case 'raid8':
                return '8인 레이드';
            case 'raid12':
                return '12인 레이드';
            case 'raid16':
                return '16인 레이드';
            default:
                return '일반';
        }
    }

    // 파티 타입별 최대 인원 가져오기
    getMaxMembers(type: 'normal' | 'raid8' | 'raid12' | 'raid16'): number {
        switch (type) {
            case 'normal':
                return 4;
            case 'raid8':
                return 8;
            case 'raid12':
                return 12;
            case 'raid16':
                return 16;
            default:
                return 4;
        }
    }

    // 빈 슬롯 색상 결정
    getEmptySlotColor(memberCount: number, slotIndex: number, partyType: 'normal' | 'raid8' | 'raid12' | 'raid16'): PartyColor {
        if (partyType === 'normal') {
            return 'red'; // 일반 파티는 모두 레드
        }

        const totalSlotIndex = memberCount + slotIndex;
        return this.getPartyColorByIndex(totalSlotIndex);
    }

    getColorCode(color: PartyColor): string {
        return PARTY_COLORS[color];
    }
}

export default new ColorUtils();
