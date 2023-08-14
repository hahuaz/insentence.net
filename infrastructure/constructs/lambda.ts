import * as path from 'path';

import * as cdk from 'aws-cdk-lib';
import {
  aws_lambda as lambda,
  aws_iam,
  CfnOutput,
  aws_cloudfront,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class LambdaConstruct extends Construct {
  public readonly sentenceProxyFunction: NodejsFunction;
  public readonly sentenceAudioCreatorFunction: NodejsFunction;
  public readonly modifyTableFunction: NodejsFunction;
  public readonly letterMapper: NodejsFunction;
  public readonly sentenceMapper: NodejsFunction;
  public readonly sitemapMapper: NodejsFunction;
  public readonly testFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);

    const { SENTENCE_TABLE_NAME, SENTENCE_BUCKET_NAME } = props;

    const BRANCH = this.node.tryGetContext('BRANCH');
    const { APP_REGION, AZURE_SPEECH_REGION } = this.node.tryGetContext(BRANCH);
    const { AZURE_SPEECH_KEY } = process.env;

    this.testFunction = new NodejsFunction(this, 'testFunction', {
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'sitemapMapper',
      entry: path.join(__dirname, `/../../lambda/test.ts`),
      bundling: {
        minify: false,
      },
    });

    this.letterMapper = new NodejsFunction(this, 'letterMapper', {
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'letterMapper',
      entry: path.join(__dirname, `/../../lambda/site-dist-mapper.ts`),
    });

    this.sentenceMapper = new NodejsFunction(this, 'sentenceMapper', {
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'sentenceMapper',
      entry: path.join(__dirname, `/../../lambda/site-dist-mapper.ts`),
    });

    this.sitemapMapper = new NodejsFunction(this, 'sitemapMapper', {
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'sitemapMapper',
      entry: path.join(__dirname, `/../../lambda/site-dist-mapper.ts`),
    });

    const modifyTableFunctionRole = new aws_iam.Role(
      this,
      'modifyTableFunctionRole',
      {
        assumedBy: new aws_iam.ServicePrincipal('lambda.amazonaws.com'),
      }
    );

    modifyTableFunctionRole.addManagedPolicy(
      aws_iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
    );

    this.modifyTableFunction = new NodejsFunction(this, 'modifyTableFunction', {
      memorySize: 128,
      timeout: cdk.Duration.seconds(60),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, `/../../lambda/modify-table.ts`),
      environment: {
        APP_REGION,
        SENTENCE_TABLE_NAME,
      },
      role: modifyTableFunctionRole,
    });

    this.sentenceProxyFunction = new NodejsFunction(this, 'sentence-proxy', {
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, `/../../lambda/sentence-proxy.ts`),
      environment: {
        APP_REGION,
        SENTENCE_TABLE_NAME,
      },
    });

    this.sentenceAudioCreatorFunction = new NodejsFunction(
      this,
      'sentence-audio-creator',
      {
        memorySize: 128,
        timeout: cdk.Duration.seconds(180),
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        entry: path.join(__dirname, `/../../lambda/sentence-audio-creator.ts`),
        environment: {
          APP_REGION,
          SENTENCE_TABLE_NAME,
          SENTENCE_BUCKET_NAME,
          AZURE_SPEECH_KEY: AZURE_SPEECH_KEY as string,
          AZURE_SPEECH_REGION,
        },
      }
    );

    const sentenceAudioCreatorFunctionUrl =
      this.sentenceAudioCreatorFunction.addFunctionUrl({
        cors: {
          allowCredentials: true,
          allowedOrigins: ['*'],
          allowedMethods: [lambda.HttpMethod.ALL],
          allowedHeaders: ['*'],
          exposedHeaders: ['*'],
        },
      });

    const sentenceAudioCreatorInvoker = new aws_iam.User(
      this,
      'sentenceAudioCreatorInvoker'
    );
    this.sentenceAudioCreatorFunction.grantInvokeUrl(
      sentenceAudioCreatorInvoker
    );

    new CfnOutput(this, 'sentenceAudioCreatorFunctionUrl', {
      // The .url attributes will return the unique Function URL
      value: sentenceAudioCreatorFunctionUrl.url,
    });
  }
}
