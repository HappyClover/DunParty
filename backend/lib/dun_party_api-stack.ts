import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaFunctions } from './constructs/lambda-functions';
import { ApiGateway } from './constructs/api-gateway';

interface ApiStackProps extends cdk.StackProps {
  stage: string;
}

export class DunPartyApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Lambda 함수들 생성
    const lambdaFunctions = new LambdaFunctions(this, 'LambdaFunctions', {
      stage: props.stage,
    });

    // API Gateway 및 라우트 설정
    new ApiGateway(this, 'ApiGateway', {
      stage: props.stage,
      lambdaFunctions: lambdaFunctions.functions,
    });
  }
}