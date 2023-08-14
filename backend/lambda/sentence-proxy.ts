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
  getSearch: 'GET /search',
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

  if (routeKey === routes.getSearch) {
    const { q } = queryStringParameters || {};
    if (!q) return createResponse(400);

    const letter = q[0];

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      ExpressionAttributeNames: {
        '#PK': 'partitionKey',
        '#SK': 'sortKey',
      },
      ExpressionAttributeValues: {
        ':PK': `LETTER#${letter}`,
        ':SK': q,
      },
      KeyConditionExpression: '#PK = :PK AND begins_with(#SK, :SK)',
      TableName: SENTENCE_TABLE_NAME as string,
      ReturnConsumedCapacity: 'TOTAL',
      ProjectionExpression: 'sortKey',
      Limit: 5,
    };

    const scanResult = await dynamodb.query(params).promise();
    console.log(scanResult);

    const words = scanResult.Items?.map((e) => e.sortKey);

    return {
      body: JSON.stringify({ words }),
      headers: {
        'access-control-allow-origin': '*',
        'cache-control': 'no-store',
      },
      statusCode: 200,
    };
  }

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
