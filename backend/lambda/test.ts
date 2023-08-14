import * as AWS from 'aws-sdk';

import xml from 'xml';

const { SENTENCE_TABLE_NAME } = process.env;

const dynamodb = new AWS.DynamoDB.DocumentClient();

const ssm = new AWS.SSM();

export function letterMapper(event, context, callback) {
  // console.log('event', JSON.stringify(event, null, 2));

  const { request, _config } = event.Records[0].cf;

  request.uri = `/letter/[slug].html`;

  // console.log('modified request', JSON.stringify(request, null, 2));

  return callback(null, request);
}

export function sentenceMapper(event, context, callback) {
  // console.log('event', JSON.stringify(event, null, 2));

  const { request, _config } = event.Records[0].cf;

  request.uri = `/sentence/[slug].html`;

  // console.log('modified request', JSON.stringify(request, null, 2));

  return callback(null, request);
}

export async function sitemapMapper(event: any) {
  // console.log('incomingEvent', JSON.stringify(event, null, 2));

  const {
    Parameter: { Value: SENTENCE_TABLE_NAME },
  } = await ssm
    .getParameter({
      Name: 'sentenceTableName',
    })
    .promise();
  // console.log(SENTENCE_TABLE_NAME);

  const url = 'https://insentence.net';

  let pages = <any>[
    // {
    //   slug: 'sample-page-one',
    //   created: 'Dec 22 2020',
    //   lastModified: 'Feb 2 2021',
    //   changefreq: "weekly"
    // },
    // {
    //   slug: 'sample-page-two',
    //   created: 'Feb 1 2021',
    //   lastModified: 'Feb 2 2021',
    //   changefreq: "weekly"
    // },
  ];
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

  // const letterPages = await Promise.all(
  //   alphabet.map(async (letter) => {
  //     const params: AWS.DynamoDB.DocumentClient.QueryInput = {
  //       ExpressionAttributeNames: {
  //         '#PK': 'partitionKey',
  //         '#SK': 'sortKey',
  //       },
  //       ExpressionAttributeValues: {
  //         ':PK': `LETTER#${letter}`,
  //         ':SK': '#GENERAL',
  //       },
  //       KeyConditionExpression: '#PK = :PK AND #SK = :SK',
  //       TableName: SENTENCE_TABLE_NAME as string,
  //       // ScanIndexForward: false,
  //     };

  //     const {
  //       Items: [firstItem, ...rest],
  //     } = await dynamodb.query(params).promise();
  //     // console.log(firstItem);

  //     return {
  //       slug: `letter/${letter}`,
  //       modifiedAt: firstItem?.modifiedAt,
  //     };
  //   })
  // );

  const batchData = await dynamodb
    .batchGet({
      RequestItems: {
        [SENTENCE_TABLE_NAME]: {
          // a list of primary key value maps
          Keys: alphabet.map((letter) => {
            return {
              partitionKey: `LETTER#${letter}`,
              sortKey: '#GENERAL',
            };
          }),
          ConsistentRead: false,
        },
      },
    })
    .promise();

  const letterPages = alphabet.map((letter) => {
    const letterData = batchData.Responses[SENTENCE_TABLE_NAME]!.find(
      (el) => el.partitionKey === `LETTER#${letter}`
    );

    return {
      slug: `letter/${letter}`,
      modifiedAt: letterData.modifiedAt,
    };
  });

  pages = [...pages, ...letterPages];

  const indexItem = {
    url: [
      {
        loc: url,
      },
      // {
      //   lastmod: new Date().toISOString().split('T')[0],
      // },
      // { changefreq: 'weekly' },
      // { priority: '1.0' },
    ],
  };

  const sitemapItems = pages.reduce(function (items, item) {
    // build page items
    items.push({
      url: [
        {
          loc: `${url}/${item.slug}`,
        },
        // { changefreq: item.changefreq },
        {
          lastmod: new Date(item.modifiedAt ?? item.created ?? Date.now())
            .toISOString()
            .split('T')[0],
        },
      ],
    });
    return items;
  }, []);

  const sitemapObject = {
    urlset: [
      {
        _attr: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        },
      },
      indexItem,
      ...sitemapItems,
    ],
  };

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>${xml(sitemapObject)}`;

  const response = {
    status: '200',
    statusDescription: 'OK',
    headers: {
      'cache-control': [
        {
          key: 'Cache-Control',
          // value: 'max-age=100',
          value: 'no-cache',
        },
      ],
      'content-type': [
        {
          key: 'Content-Type',
          value: 'application/xml',
        },
      ],
    },
    body: sitemap,
  };

  return response;
}
