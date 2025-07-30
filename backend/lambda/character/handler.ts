import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CharacterService } from './character.service';
import { 
  CharacterSearchRequest, 
  CharacterDetailRequest,
  CharacterRouteParams 
} from './character.types';

const characterService = new CharacterService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Character Lambda executed!', JSON.stringify(event, null, 2));

  try {
    const httpMethod = event.httpMethod;
    const pathParameters = event.pathParameters as CharacterRouteParams | null;
    
    // CORS 헤더
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Content-Type': 'application/json'
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    switch (httpMethod) {
      case 'GET':
        return await handleGetRequest(event, pathParameters, corsHeaders);
      
      case 'POST':
        return await handlePostRequest(event, corsHeaders);
      
      case 'PUT':
        return await handlePutRequest(event, pathParameters, corsHeaders);
      
      case 'DELETE':
        return await handleDeleteRequest(event, pathParameters, corsHeaders);
      
      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: false, 
            message: `Method ${httpMethod} not allowed` 
          })
        };
    }
  } catch (error) {
    console.error('Handler error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    };
  }
};

/**
 * GET 요청 처리
 * - /character : 캐릭터 검색 (쿼리 파라미터 사용)
 * - /character/{characterId} : 캐릭터 상세 조회
 */
async function handleGetRequest(
  event: APIGatewayProxyEvent, 
  pathParameters: CharacterRouteParams | null,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  
  // 캐릭터 상세 조회
  if (pathParameters?.characterId) {
    const server = event.queryStringParameters?.server;
    
    if (!server) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Server parameter is required'
        })
      };
    }

    const request: CharacterDetailRequest = {
      characterId: pathParameters.characterId,
      server
    };

    const result = await characterService.getCharacterDetail(request);
    
    return {
      statusCode: result.success ? 200 : 400,
      headers,
      body: JSON.stringify(result)
    };
  }
  
  // 캐릭터 검색
  const name = event.queryStringParameters?.name;
  const server = event.queryStringParameters?.server;
  const limit = event.queryStringParameters?.limit ? 
    parseInt(event.queryStringParameters.limit) : undefined;

  if (!name || !server) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Name and server parameters are required'
      })
    };
  }

  // 유효성 검사
  const nameValidation = characterService.validateCharacterName(name);
  if (!nameValidation.valid) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        message: nameValidation.message
      })
    };
  }

  const serverValidation = characterService.validateServerId(server);
  if (!serverValidation.valid) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        message: serverValidation.message
      })
    };
  }

  const request: CharacterSearchRequest = { name, server, limit };
  const result = await characterService.searchCharacters(request);
  
  return {
    statusCode: result.success ? 200 : 400,
    headers,
    body: JSON.stringify(result)
  };
}

/**
 * POST 요청 처리 - 향후 확장용 (캐릭터 즐겨찾기 등)
 */
async function handlePostRequest(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 501,
    headers,
    body: JSON.stringify({
      success: false,
      message: 'POST method not implemented yet'
    })
  };
}

/**
 * PUT 요청 처리 - 향후 확장용
 */
async function handlePutRequest(
  event: APIGatewayProxyEvent,
  pathParameters: CharacterRouteParams | null,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 501,
    headers,
    body: JSON.stringify({
      success: false,
      message: 'PUT method not implemented yet'
    })
  };
}

/**
 * DELETE 요청 처리 - 향후 확장용
 */
async function handleDeleteRequest(
  event: APIGatewayProxyEvent,
  pathParameters: CharacterRouteParams | null,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 501,
    headers,
    body: JSON.stringify({
      success: false,
      message: 'DELETE method not implemented yet'
    })
  };
}