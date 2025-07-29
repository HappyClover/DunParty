import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import {Duration} from "aws-cdk-lib";

interface LambdaFunctionsProps {
  stage: string;
}

export class LambdaFunctions extends Construct {
  public readonly functions: { [key: string]: lambda.Function };

  constructor(scope: Construct, id: string, props: LambdaFunctionsProps) {
    super(scope, id);

    const commonProps = {
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: Duration.seconds(30),
      environment: {
        STAGE: props.stage,
        NEOPLE_API_KEY: process.env.NEOPLE_API_KEY || '',
      },
    };

    this.functions = {
      auth: new lambda.Function(this, 'AuthFunction', {
        ...commonProps,
        handler: 'auth/handler.handler',
        code: lambda.Code.fromAsset('lambda'),
      }),

      character: new lambda.Function(this, 'CharacterFunction', {
        ...commonProps,
        handler: 'character/handler.handler',
        code: lambda.Code.fromAsset('lambda'),
      }),

      adventure: new lambda.Function(this, 'AdventureFunction', {
        ...commonProps,
        handler: 'adventure/handler.handler',
        code: lambda.Code.fromAsset('lambda'),
      }),
    };
  }
}