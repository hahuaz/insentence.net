#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
dotenv.config();

import { InSent } from '../infrastructure/in_sent';

// To avoid recurring costs from Secret Manager service, we will utilize .env files. However, this approach has the disadvantage of not being able to use CI/CD pipelines.
const { AZURE_SPEECH_KEY, DOMAIN_CERTIFICATE, STAR_SUBDOMAIN_CERTIFICATE } =
  process.env;

if (!AZURE_SPEECH_KEY || !DOMAIN_CERTIFICATE || !STAR_SUBDOMAIN_CERTIFICATE) {
  throw new Error('missing env variable.');
}

const app = new cdk.App();
const BRANCH = app.node.tryGetContext('BRANCH');
const { APP_NAME, ACCOUNT, APP_REGION } = app.node.tryGetContext(BRANCH);
console.log(BRANCH);

new InSent(app, `${BRANCH}-${APP_NAME}`, {
  env: { account: ACCOUNT, region: APP_REGION },
});
