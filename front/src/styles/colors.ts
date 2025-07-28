// 파티 색상 정의
export const PARTY_COLORS = {
  red: '#F38181',
  yellow: '#FEF08A',
  green: '#95E1D3',
  blue: 'blue',
} as const;

export type PartyColor = keyof typeof PARTY_COLORS;

// 파티 색상 이름 매핑
export const PARTY_COLOR_NAMES: Record<PartyColor, string> = {
  red: '레드 파티',
  yellow: '옐로 파티',
  green: '그린 파티',
  blue: '블루 파티',
};

// 파티 색상 배열 (순서대로 할당할 때 사용)
export const PARTY_COLOR_ORDER: PartyColor[] = [
  'red', 'yellow', 'green', 'blue'
];

// 파티 타입별 색상 매핑
export const PARTY_TYPE_COLORS = {
  normal: 'red',
  raid8: 'yellow',
  raid12: 'green', 
  raid16: 'orange'
} as const;

// 역할별 색상
export const ROLE_COLORS = {
  dealer: 'blue',
  buffer: 'green',
  leader: 'purple'
} as const;

// 난이도별 색상
export const DIFFICULTY_COLORS = {
  easy: 'green',
  normal: 'blue',
  hard: 'orange',
  expert: 'red'
} as const;

// 상태별 색상
export const STATUS_COLORS = {
  recruiting: 'blue',
  full: 'gray',
  inProgress: 'orange',
  completed: 'green'
} as const;