#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NeOnePlayCdkStack } from '../lib/ne-one-play-cdk-stack';

const app = new cdk.App();
const envName = app.node.tryGetContext("envName");
if (!envName) {
  throw new Error('No environment name provided for stack');
}
new NeOnePlayCdkStack(app, 'NeOnePlayCdkStack' + envName, {
  envName: envName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

/**************
 * Tagging all resources in stack
 */
cdk.Tags.of(app).add('application-name', 'ne-one-play');
cdk.Tags.of(app).add('application-env', envName);