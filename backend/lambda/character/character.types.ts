// 네오플 API 응답 타입들
export interface NeopleDFCharacter {
  serverId: string;
  characterId: string;
  characterName: string;
  level: number;
  jobId: string;
  jobGrowId: string;
  jobName: string;
  jobGrowName: string;
  fame?: number;
  adventureName?: string;
  guildId?: string;
  guildName?: string;
}

export interface NeopleDFCharacterSearchResponse {
  characters: NeopleDFCharacter[];
}

export interface NeopleDFCharacterDetailResponse {
  characterId: string;
  characterName: string;
  level: number;
  jobId: string;
  jobGrowId: string;
  jobName: string;
  jobGrowName: string;
  adventureName: string;
  guildId: string;
  guildName: string;
  // 추가 상세 정보들...
}

// 캐릭터 스탯정보
export interface CharacterStats {
  str: number;                   // 힘
  int: number;                   // 지능
  physicalAttack: number;        // 물리 공격력
  magicAttack: number;           // 마법 공격력
  independentAttack: number;     // 독립 공격력
  elementEnhance: number;        // 속성 강화 (예: 화속성 강화)
  attackIncrease: number;        // 공격력 증가 수치
  finalDamageIncrease: number;   // 최종 데미지 증가 수치 (퍼센트)
}

// 🆕 데이터베이스 엔티티 타입 (우리 시스템의 캐릭터)
export interface Character {
  id: string;                    // UUID
  userId: string;                // 소유자 ID
  neopleCharacterId: string;     // 네오플 API의 캐릭터 ID
  serverId: string;              // 서버 ID (anton, bakal 등)
  characterName: string;         // 캐릭터 이름
  jobName?: string;              // 직업명
  jobGrowName?: string;          // 각성명
  level: number;                 // 레벨
  isFavorite: boolean;           // 즐겨찾기 여부
  lastSyncAt?: string;           // 마지막 동기화 시간
  createdAt: string;             // 생성일
  updatedAt: string;             // 수정일
}

// 🆕 캐릭터 생성 요청 타입
export interface CreateCharacterRequest {
  id: string;                    // UUID (클라이언트에서 생성)
  userId: string;                // 현재 사용자 ID
  neopleCharacterId: string;     // 네오플 API에서 가져온 캐릭터 ID
  serverId: string;              // 서버 ID
  characterName: string;         // 캐릭터 이름
  jobName?: string;              // 직업명
  jobGrowName?: string;          // 각성명
  level: number;                 // 레벨
  isFavorite?: boolean;          // 즐겨찾기 여부 (기본값: false)
}

// 🆕 캐릭터 수정 요청 타입
export interface UpdateCharacterRequest {
  isFavorite?: boolean;          // 즐겨찾기 상태 변경
  lastSyncAt?: string;           // 동기화 시간 업데이트
  level?: number;                // 레벨 업데이트 (네오플 API에서 가져온 최신 정보)
  jobName?: string;              // 직업명 업데이트
  jobGrowName?: string;          // 각성명 업데이트
}

// API 요청/응답 타입들
export interface CharacterSearchRequest {
  name: string;
  server: string;
  limit?: number;
}

export interface CharacterDetailRequest {
  characterId: string;
  server: string;
}

// 🆕 내 캐릭터 목록 조회 요청
export interface MyCharactersRequest {
  userId: string;
  includeNonFavorites?: boolean;  // 즐겨찾기가 아닌 캐릭터도 포함할지
  limit?: number;
  offset?: number;
}

// 🆕 캐릭터 동기화 요청 (네오플 API에서 최신 정보 가져오기)
export interface SyncCharacterRequest {
  characterId: string;           // 우리 DB의 캐릭터 ID
  forceSync?: boolean;           // 강제 동기화 여부
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 라우트 파라미터 타입
export interface CharacterRouteParams {
  characterId?: string;
}

// 🆕 확장된 HTTP 메서드별 요청 타입
export type CharacterRequest = 
  | CharacterSearchRequest       // GET /character?name=xxx&server=xxx (네오플 API 검색)
  | CharacterDetailRequest       // GET /character/neople/{characterId}?server=xxx (네오플 API 상세)
  | MyCharactersRequest         // GET /character/my (내 캐릭터 목록)
  | CreateCharacterRequest      // POST /character (캐릭터 즐겨찾기 추가)
  | UpdateCharacterRequest      // PUT /character/{characterId} (캐릭터 정보 수정)
  | SyncCharacterRequest;       // POST /character/{characterId}/sync (캐릭터 동기화)

// 🆕 캐릭터 응답 타입들
export interface CharacterListResponse {
  characters: Character[];
  total: number;
  page?: number;
  limit?: number;
}

export interface CharacterSyncResponse {
  character: Character;
  syncedAt: string;
  changes: string[];             // 변경된 필드들
}

// 🆕 서버 목록 타입
export interface DFServer {
  serverId: string;
  serverName: string;
}

export interface ServerListResponse {
  servers: DFServer[];
}

// 🆕 에러 타입
export enum CharacterErrorCode {
  CHARACTER_NOT_FOUND = 'CHARACTER_NOT_FOUND',
  INVALID_SERVER = 'INVALID_SERVER',
  NEOPLE_API_ERROR = 'NEOPLE_API_ERROR',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export interface CharacterError {
  code: CharacterErrorCode;
  message: string;
  details?: any;
}