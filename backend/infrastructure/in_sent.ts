import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  aws_cloudfront,
  aws_cloudfront_origins as cfOrigins,
  aws_certificatemanager as cm,
  aws_ssm,
} from "aws-cdk-lib";

import { ApiConstruct } from "./constructs/api";
import { LambdaConstruct } from "./constructs/lambda";
import { StorageConstruct } from "./constructs/storage";

export class InSent extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const BRANCH = this.node.tryGetContext("BRANCH");
    const { DOMAIN_NAME } = this.node.tryGetContext(BRANCH);

    const { DOMAIN_CERTIFICATE, STAR_SUBDOMAIN_CERTIFICATE } = process.env;

    // CUSTOM CONSTRUCTS
    const { sentenceTable, audioBucket, siteBucket, sentenceTableParam } =
      new StorageConstruct(this, `storage`, {});

    // lamba, depends on storage
    const {
      sentenceProxyFunction,
      sentenceAudioCreatorFunction,
      modifyTableFunction,
      letterMapper,
      sentenceMapper,
      sitemapMapper,
      testFunction,
    } = new LambdaConstruct(this, `lambda`, {
      SENTENCE_TABLE_NAME: sentenceTable.tableName,
      SENTENCE_BUCKET_NAME: audioBucket.bucketName,
    });

    // api, depends on lambda
    const { api: _api, sentenceProxy: _sentenceProxy } = new ApiConstruct(
      this,
      `api`,
      {
        sentenceProxyFunction,
      }
    );

    sentenceTable.grantReadData(sentenceProxyFunction);
    sentenceTable.grantReadData(sitemapMapper);
    sentenceTable.grantFullAccess(sentenceAudioCreatorFunction);

    sentenceTableParam.grantRead(sitemapMapper);

    audioBucket.grantReadWrite(sentenceAudioCreatorFunction);

    // TODO REMOVE ACCESS
    sentenceTable.grantReadWriteData(testFunction);
    sentenceTableParam.grantRead(testFunction);

    // const sentenceAudioCreatorDLQ = new sqs.Queue(
    //   this,
    //   'sentenceAudioCreatorDLQ',
    //   {
    //     retentionPeriod: cdk.Duration.days(14),
    //     visibilityTimeout: cdk.Duration.minutes(10),
    //   }
    // );

    // TODO increase batch size and implement batchItemFailures
    // sentenceAudioCreatorFunction.addEventSource(
    //   new les.DynamoEventSource(sentenceTable, {
    //     batchSize: 1,
    //     startingPosition: lambda.StartingPosition.TRIM_HORIZON,
    //     retryAttempts: 0,
    //     onFailure: new les.SqsDlq(sentenceAudioCreatorDLQ),
    //   })
    // );

    const customCachePolicy = new aws_cloudfront.CachePolicy(
      this,
      "cachePolicy",
      {
        defaultTtl: cdk.Duration.days(0),
        minTtl: cdk.Duration.minutes(0),
        maxTtl: cdk.Duration.days(0),
      }
    );

    const customResponsePolicy = new aws_cloudfront.ResponseHeadersPolicy(
      this,
      "customResponsePolicy2",
      {
        // TODO activate browser cache
        // customHeadersBehavior: {
        //   customHeaders: [
        //     {
        //       header: 'Cache-Control',
        //       value: 'max-age=2592000',
        //       override: true,
        //     },
        //   ],
        // },
        corsBehavior: {
          accessControlAllowOrigins: ["*"],
          accessControlAllowMethods: ["HEAD", "GET", "OPTIONS"],
          accessControlAllowHeaders: ["*"],
          originOverride: true,
          accessControlAllowCredentials: false,
        },
      }
    );

    const siteBucketOrigin = new cfOrigins.S3Origin(siteBucket);

    const siteBucketDist = new aws_cloudfront.Distribution(
      this,
      "siteBucketDist",
      {
        defaultBehavior: {
          origin: siteBucketOrigin,
          viewerProtocolPolicy:
            aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachePolicy: customCachePolicy,
          responseHeadersPolicy: customResponsePolicy,
        },
        additionalBehaviors: {
          "letter/*": {
            origin: siteBucketOrigin,
            edgeLambdas: [
              {
                functionVersion: letterMapper.currentVersion,
                eventType: aws_cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
              },
            ],
          },
          "sentence/*": {
            origin: siteBucketOrigin,
            edgeLambdas: [
              {
                functionVersion: sentenceMapper.currentVersion,
                eventType: aws_cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
              },
            ],
          },
          // 'sitemap.xml': {
          //   origin: siteBucketOrigin,
          //   edgeLambdas: [
          //     {
          //       functionVersion: sitemapMapper.currentVersion,
          //       eventType: aws_cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
          //     },
          //   ],
          // },
        },
        // defaultRootObject: '/index.html',
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 404,
            responsePagePath: "/404.html",
          },
        ],
        domainNames: [DOMAIN_NAME],
        // CF distribution only accept certificates that is on us-east-1
        certificate: cm.Certificate.fromCertificateArn(
          this,
          "DOMAIN_CERTIFICATE",
          DOMAIN_CERTIFICATE as string
        ),
      }
    );

    const audioBucketDist = new aws_cloudfront.Distribution(
      this,
      "audioBucketDist",
      {
        defaultBehavior: {
          origin: new cfOrigins.S3Origin(audioBucket),
          viewerProtocolPolicy:
            aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachePolicy: new aws_cloudfront.CachePolicy(
            this,
            "audioBucketDistCachePolicy",
            {
              defaultTtl: cdk.Duration.days(30),
              minTtl: cdk.Duration.minutes(30),
              maxTtl: cdk.Duration.days(60),
            }
          ),
          responseHeadersPolicy: new aws_cloudfront.ResponseHeadersPolicy(
            this,
            "audioBucketDistResponsePolicy",
            {
              // TODO activate browser cache
              // customHeadersBehavior: {
              //   customHeaders: [
              //     {
              //       header: 'Cache-Control',
              //       value: 'max-age=2592000',
              //       override: true,
              //     },
              //   ],
              // },
              corsBehavior: {
                accessControlAllowOrigins: ["*"],
                accessControlAllowMethods: ["HEAD", "GET", "OPTIONS"],
                accessControlAllowHeaders: ["*"],
                originOverride: true,
                accessControlAllowCredentials: false,
              },
            }
          ),
        },

        domainNames: [`cdn.${DOMAIN_NAME}`],
        // CF distribution only accept certificates that is on us-east-1
        certificate: cm.Certificate.fromCertificateArn(
          this,
          "STAR_SUBDOMAIN_CERTIFICATE",
          STAR_SUBDOMAIN_CERTIFICATE as string
        ),
      }
    );

    // TODO create hosted zone by cdk

    // CFN OUTPUTS
    new cdk.CfnOutput(this, "siteBucketDistDomain", {
      value: siteBucketDist.distributionDomainName,
      description: "The domain name of siteBucketDist",
    });
    new cdk.CfnOutput(this, "audioBucketDistDomain", {
      value: audioBucketDist.distributionDomainName,
      description: "The domain name of audioBucketDist",
    });
  }
}
