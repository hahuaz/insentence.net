import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { default as axios } from 'axios';
import * as AWS from 'aws-sdk';

import { createResponse } from './helpers/index';

const { APP_REGION, SENTENCE_TABLE_NAME } = process.env;

AWS.config.update({ region: APP_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const routes = {
  getSentence: 'GET /sentence',
  getWordList: 'GET /word',
};
export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.log('incomingEvent', JSON.stringify(event, null, 2));

  const { httpMethod, path, queryStringParameters } = event;

  const routeKey = `${httpMethod} ${path}`;

  // return early if route is not found
  if (!Object.values(routes).includes(routeKey))
    return createResponse(200, 'invalid route');

  if (routeKey === routes.getSentence) {
    const { word } = queryStringParameters || {};
    if (!word) return createResponse(400);

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      ExpressionAttributeNames: {
        '#PK': 'partitionKey',
      },
      ExpressionAttributeValues: {
        ':PK': `WORD#${word}`,
      },
      KeyConditionExpression: '#PK = :PK',
      TableName: SENTENCE_TABLE_NAME as string,
      // ScanIndexForward: false,
    };

    const { Items } = await dynamodb.query(params).promise();

    return {
      body: JSON.stringify(Items),
      headers: {
        'access-control-allow-origin': '*',
        'cache-control': 'no-store',
      },
      statusCode: 200,
    };
  }

  if (routeKey === routes.getWordList) {
    const startsWith = queryStringParameters?.['starts-with'];
    if (!startsWith) return createResponse(400);
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      ExpressionAttributeNames: {
        '#PK': 'partitionKey',
      },
      // TODO make letter dynamic
      ExpressionAttributeValues: {
        ':PK': `LETTER#${startsWith}`,
      },
      KeyConditionExpression: '#PK = :PK',
      TableName: SENTENCE_TABLE_NAME as string,
      // ScanIndexForward: false,
    };

    const { Items } = await dynamodb.query(params).promise();

    // remove the sortKey, #GENERAL
    const generalIndex = Items!.findIndex(
      (item) => item.sortKey === '#GENERAL'
    );
    if (generalIndex > -1) {
      Items!.splice(generalIndex, 1);
    }

    console.log(Items);

    return {
      body: JSON.stringify(Items),
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'cache-control': 'no-store',
      },
      statusCode: 200,
    };
  }

  return createResponse(200, 'invalid routes config');
}
