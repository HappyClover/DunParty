#!/usr/bin/env node
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import { DunPartyApiStack } from '../lib/dun_party_api-stack';

const app = new cdk.App();

new DunPartyApiStack(app, 'RaidApiStackDev', {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    stage: 'dev',
});