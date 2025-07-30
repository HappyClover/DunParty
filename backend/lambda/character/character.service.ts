import {
    NeopleDFCharacterSearchResponse,
    NeopleDFCharacterDetailResponse,
    CharacterSearchRequest,
    CharacterDetailRequest,
    ApiResponse
} from './character.types';

export class CharacterService {
    private readonly baseUrl = 'https://api.neople.co.kr/df';
    private readonly apiKey: string;

    constructor() {
        this.apiKey = process.env.NEOPLE_API_KEY || '';

        if (!this.apiKey) {
            throw new Error('NEOPLE_API_KEY environment variable is required');
        }
    }

    /**
     * 캐릭터 검색
     */
    async searchCharacters(request: CharacterSearchRequest): Promise<ApiResponse<NeopleDFCharacterSearchResponse>> {
        try {
            const { name, server, limit = 10 } = request;

            const url = `${this.baseUrl}/servers/${server}/characters` +
                `?characterName=${encodeURIComponent(name)}` +
                `&wordType=full` +
                `&limit=${limit}` +
                `&apikey=${this.apiKey}`;

            console.log(`Searching characters: ${url}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Neople API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json() as NeopleDFCharacterSearchResponse;

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Character search error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * 캐릭터 상세 정보 조회
     */
    async getCharacterDetail(request: CharacterDetailRequest): Promise<ApiResponse<NeopleDFCharacterDetailResponse>> {
        try {
            const { characterId, server } = request;

            const url = `${this.baseUrl}/servers/${server}/characters/${characterId}` +
                `?apikey=${this.apiKey}`;

            console.log(`Getting character detail: ${url}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Neople API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json() as NeopleDFCharacterDetailResponse;

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Character detail error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * 서버 목록 조회 (유틸리티 메서드)
     */
    async getServers(): Promise<ApiResponse<any>> {
        try {
            const url = `${this.baseUrl}/servers?apikey=${this.apiKey}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Neople API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Get servers error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * 캐릭터 이름 유효성 검사
     */
    validateCharacterName(name: string): { valid: boolean; message?: string } {
        if (!name || name.trim().length === 0) {
            return { valid: false, message: 'Character name is required' };
        }

        if (name.length < 2 || name.length > 12) {
            return { valid: false, message: 'Character name must be between 2-12 characters' };
        }

        return { valid: true };
    }

    /**
     * 서버 ID 유효성 검사
     */
    validateServerId(serverId: string): { valid: boolean; message?: string } {
        const validServers = [
            'anton', 'bakal', 'cain', 'casillas', 'diregie', 'hilder', 'prey', 'siroco'
        ];

        if (!validServers.includes(serverId.toLowerCase())) {
            return {
                valid: false,
                message: `Invalid server. Valid servers: ${validServers.join(', ')}`
            };
        }

        return { valid: true };
    }
}

export class CharacterImageService {
    //https://img-api.neople.co.kr/df/servers/casillas/characters/f3001b1206d774ff2d768b5a90ab51ae?zoom=1
    private readonly baseUrl = 'https://img-api.neople.co.kr/df/';
    private readonly apiKey: string;

    getImageUrl(characterId: string, serverId: string, zoom: number = 1): string {
        return `${this.baseUrl}servers/${serverId}/characters/${characterId}?zoom=${zoom}&apikey=${this.apiKey}`;
    }
}