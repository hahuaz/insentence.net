import { S3, DynamoDB } from 'aws-sdk';
import { randomUUID } from 'crypto';
import * as speechSdk from 'microsoft-cognitiveservices-speech-sdk';

const {
  APP_REGION,
  AZURE_SPEECH_KEY,
  AZURE_SPEECH_REGION,
  SENTENCE_TABLE_NAME,
  SENTENCE_BUCKET_NAME,
} = process.env;

const speechConfig = speechSdk.SpeechConfig.fromSubscription(
  AZURE_SPEECH_KEY as string,
  AZURE_SPEECH_REGION as string
);
// set the quality of output
speechConfig.speechSynthesisOutputFormat =
  speechSdk.SpeechSynthesisOutputFormat.Webm24Khz16BitMonoOpus;

const speechSynthesis = (sentence: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const synthesizer = new speechSdk.SpeechSynthesizer(speechConfig);
    const voices = {
      aria: 'en-US-AriaNeural',
      jenny: 'en-US-JennyNeural',
    };

    synthesizer.speakSsmlAsync(
      `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="${voices.aria}"><prosody rate="-10%" pitch="0%">${sentence}</prosody></voice></speak>`,
      (result) => {
        const { audioData } = result;

        synthesizer.close();

        const buffer = Buffer.from(audioData);

        if (!audioData) {
          throw Error('Audio request failed. Please try again.');
        }

        resolve(buffer);
      },
      (error) => {
        console.log(error);
        synthesizer.close();
        reject(error);
      }
    );
  });
};

const dynamoClient = new DynamoDB.DocumentClient();
const s3 = new S3();

export async function handler(event: any) {
  console.log('event', JSON.stringify(event, null, 2));

  let { word, sentences } = JSON.parse(event.body);
  if (!sentences || !word)
    return {
      statusCode: 400,
    };

  word = word.trim().toLowerCase();

  await Promise.all(
    sentences.map(async ({ sentence, styledSentence }) => {
      if (!sentence) return;
      const getSpeech = await speechSynthesis(sentence);

      const randomId = randomUUID();
      const s3Key = `${word}/${randomId}`;

      await s3
        .putObject({
          Bucket: SENTENCE_BUCKET_NAME as string,
          Key: s3Key,
          Body: getSpeech,
          // ContentType: 'audio/mpeg',
        })
        .promise();

      const audioUrl = `https://${SENTENCE_BUCKET_NAME}.s3.${APP_REGION}.amazonaws.com/${s3Key}`;

      await dynamoClient
        .put({
          TableName: SENTENCE_TABLE_NAME as string,
          Item: {
            partitionKey: `WORD#${word}`,
            sortKey: s3Key,
            createdAt: Date.now(),
            sentence,
            styledSentence,
            audioUrl,
          },
          // ConditionExpression: 'attribute_exists(id)', // DO NOT MODIFY. IT PREVENTS STREAM LOOP. this condition makes sure new document won't be created and only update will happen. it will throw error if document doesn't exist.
        })
        .promise();

      // put word to wordList
      try {
        const firstLetter = word[0];
        await dynamoClient
          .update({
            TableName: SENTENCE_TABLE_NAME as string,
            Key: {
              partitionKey: `LETTER#${firstLetter}`,
              sortKey: word,
            },

            ConditionExpression: 'attribute_not_exists(sortKey)', // only create new document if it doesn't exist
          })
          .promise();
      } catch (error) {
        console.log('expected err that condition is failed.');
      }

      // update letter modified time
      try {
        const firstLetter = word[0];
        await dynamoClient
          .update({
            TableName: SENTENCE_TABLE_NAME as string,
            Key: {
              partitionKey: `LETTER#${firstLetter}`,
              sortKey: '#GENERAL',
            },

            ExpressionAttributeNames: {
              '#MA': 'modifiedAt',
            },
            ExpressionAttributeValues: {
              ':MA': Date.now(),
            },
            UpdateExpression: 'set #MA = :MA',
          })
          .promise();
      } catch (error) {
        console.log('update letter modified time');
      }
    })
  );

  return {
    statusCode: 200,
  };
}
