// 테마 관련 상수
export const THEME = {
  // 사이즈
  sizes: {
    sidebar: '250px',
    header: '70px',
    maxContainerWidth: '8xl'
  },
  
  // 간격
  spacing: {
    page: 8,
    section: 6,
    card: 4
  },
  
  // 그림자
  shadows: {
    card: 'md',
    sidebar: 'md'
  },
  
  // 보더 반경
  radii: {
    card: 'lg',
    button: 'md'
  }
} as const;

// 반응형 브레이크포인트
export const BREAKPOINTS = {
  base: 'base',
  sm: 'sm', 
  md: 'md',
  lg: 'lg',
  xl: 'xl'
} as const;