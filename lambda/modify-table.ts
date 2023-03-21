import { DynamoDB } from 'aws-sdk';

const { APP_REGION, SENTENCE_TABLE_NAME } = process.env;

const dynamodbClient = new DynamoDB.DocumentClient({
  region: APP_REGION,
});

const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

export async function handler(event: any) {
  const created = await Promise.all(
    alphabet.map(async (letter) => {
      const words = await dynamodbClient
        .query({
          TableName: SENTENCE_TABLE_NAME as string,
          ExpressionAttributeNames: {
            '#PK': 'partitionKey',
          },
          ExpressionAttributeValues: {
            ':PK': `LETTER#${letter}`,
          },
          KeyConditionExpression: '#PK = :PK',
        })
        .promise();

      let modifiedWords = words.Items?.map((word) => {
        if (word.sortKey === '#GENERAL') {
          console.log('general word');
          return;
        }
        delete word.modifiedAt;
        return word;
      });

      modifiedWords = modifiedWords?.filter((word) => word !== undefined);

      console.log(modifiedWords);

      await Promise.all(
        modifiedWords!.map(async (word) => {
          await dynamodbClient
            .update({
              TableName: SENTENCE_TABLE_NAME as string,

              Key: word!,
              ExpressionAttributeNames: {
                '#MA': 'modifiedAt',
              },
              // TODO pass more information about the error from event
              UpdateExpression: 'REMOVE  #MA',
              // ConditionExpression: 'attribute_exists(desktopVideoS3Key)', // DO NOT MODIFY. IT PREVENTS STREAM LOOP. this condition makes sure new document won't be created and only update will happen. it will throw error if document doesn't exist.
            })
            .promise();
        })
      );
    })
  );
  return {
    statusCode: 200,
  };
}
