import { DatabaseService } from '../utils/database';
import {
  Character,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  MyCharactersRequest,
  CharacterListResponse
} from './character.types';

export class CharacterRepository {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * 사용자 ID로 캐릭터 목록 조회
   */
  async findByUserId(request: MyCharactersRequest): Promise<CharacterListResponse> {
    let sql = `
      SELECT * FROM characters 
      WHERE user_id = ?
    `;
    const params: any[] = [request.userId];

    // 즐겨찾기만 조회할지 결정
    if (!request.includeNonFavorites) {
      sql += ` AND is_favorite = true`;
    }

    sql += ` ORDER BY is_favorite DESC, updated_at DESC`;

    // 페이징 처리
    if (request.limit) {
      sql += ` LIMIT ?`;
      params.push(request.limit);

      if (request.offset) {
        sql += ` OFFSET ?`;
        params.push(request.offset);
      }
    }

    const result = await this.db.executeStatement(sql, params);
    const characters = result.records?.map(this.mapToCharacter) || [];

    // 총 개수 조회
    let countSql = `SELECT COUNT(*) as total FROM characters WHERE user_id = ?`;
    const countParams = [request.userId];

    if (!request.includeNonFavorites) {
      countSql += ` AND is_favorite = true`;
    }

    const countResult = await this.db.executeStatement(countSql, countParams);
    const total = countResult.records?.[0]?.total?.longValue || 0;

    return {
      characters,
      total,
      page: request.offset ? Math.floor(request.offset / (request.limit || 10)) + 1 : 1,
      limit: request.limit
    };
  }

  /**
   * ID로 캐릭터 조회
   */
  async findById(id: string): Promise<Character | null> {
    const sql = `SELECT * FROM characters WHERE id = ?`;
    const result = await this.db.executeStatement(sql, [id]);

    return result.records?.[0] ? this.mapToCharacter(result.records[0]) : null;
  }

  /**
   * 네오플 캐릭터 ID와 서버로 캐릭터 조회 (중복 체크용)
   */
  async findByNeopleId(userId: string, neopleCharacterId: string, serverId: string): Promise<Character | null> {
    const sql = `
      SELECT * FROM characters 
      WHERE user_id = ? AND neople_character_id = ? AND server_id = ?
    `;
    const result = await this.db.executeStatement(sql, [userId, neopleCharacterId, serverId]);

    return result.records?.[0] ? this.mapToCharacter(result.records[0]) : null;
  }

  /**
   * 캐릭터 생성
   */
  async create(character: CreateCharacterRequest): Promise<Character> {
    const sql = `
      INSERT INTO characters (
        id, user_id, neople_character_id, server_id, 
        character_name, job_name, job_grow_name, level, is_favorite, last_sync_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    await this.db.executeStatement(sql, [
      character.id,
      character.userId,
      character.neopleCharacterId,
      character.serverId,
      character.characterName,
      character.jobName || null,
      character.jobGrowName || null,
      character.level,
      character.isFavorite || false
    ]);

    const created = await this.findById(character.id);
    if (!created) {
      throw new Error('Failed to create character');
    }

    return created;
  }

  /**
   * 캐릭터 정보 수정
   */
  async update(id: string, updates: UpdateCharacterRequest): Promise<Character | null> {
    const setParts: string[] = [];
    const params: any[] = [];

    if (updates.isFavorite !== undefined) {
      setParts.push('is_favorite = ?');
      params.push(updates.isFavorite);
    }

    if (updates.level !== undefined) {
      setParts.push('level = ?');
      params.push(updates.level);
    }

    if (updates.jobName !== undefined) {
      setParts.push('job_name = ?');
      params.push(updates.jobName);
    }

    if (updates.jobGrowName !== undefined) {
      setParts.push('job_grow_name = ?');
      params.push(updates.jobGrowName);
    }

    if (updates.lastSyncAt !== undefined) {
      setParts.push('last_sync_at = ?');
      params.push(updates.lastSyncAt);
    }

    if (setParts.length === 0) {
      return this.findById(id); // 변경사항이 없으면 기존 데이터 반환
    }

    setParts.push('updated_at = NOW()');
    params.push(id);

    const sql = `UPDATE characters SET ${setParts.join(', ')} WHERE id = ?`;
    await this.db.executeStatement(sql, params);

    return this.findById(id);
  }

  /**
   * 캐릭터 삭제
   */
  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM characters WHERE id = ?`;
    const result = await this.db.executeStatement(sql, [id]);

    return (result.numberOfRecordsUpdated || 0) > 0;
  }

  /**
   * 데이터베이스 레코드를 Character 객체로 매핑
   */
  private mapToCharacter(record: any): Character {
    return {
      id: record.id.stringValue,
      userId: record.user_id.stringValue,
      neopleCharacterId: record.neople_character_id.stringValue,
      serverId: record.server_id.stringValue,
      characterName: record.character_name.stringValue,
      jobName: record.job_name?.stringValue || undefined,
      jobGrowName: record.job_grow_name?.stringValue || undefined,
      level: record.level?.longValue || 1,
      isFavorite: record.is_favorite?.booleanValue || false,
      lastSyncAt: record.last_sync_at?.stringValue || undefined,
      createdAt: record.created_at.stringValue,
      updatedAt: record.updated_at.stringValue,
    };
  }
}