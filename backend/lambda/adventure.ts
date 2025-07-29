import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    console.log("Lambda executed!", event);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello from Lambda!" })
    };
};