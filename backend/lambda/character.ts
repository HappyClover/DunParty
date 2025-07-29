import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const name = event.queryStringParameters?.name;
    const server = event.queryStringParameters?.server;

    if (!name || !server) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid request" })
        };
    }

    const CharaterInfo = `https://api.neople.co.kr/df/servers/${server}/characters?characterName=${encodeURIComponent(name)}&wordType=full&limit=10&apikey=BDIcrd4Wjuutr5hqA0l5ia95kMRakgm5`

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello from Lambda!" })
    };
};