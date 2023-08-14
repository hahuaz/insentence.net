import { APIGatewayProxyResult } from 'aws-lambda';

export const createResponse = (
  statusCode: number,
  message?: string
): APIGatewayProxyResult => {
  const response: any = {
    statusCode,
    headers: {
      'access-control-allow-origin': '*',
      'cache-control': 'no-store',
    },
  };

  if (message) {
    response.headers['content-type'] = 'application/json';
    return {
      ...response,
      body: JSON.stringify({
        message,
      }),
    };
  } else {
    return response;
  }
};
