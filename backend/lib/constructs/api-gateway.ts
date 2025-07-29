import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
// import { AuthRoutes } from '../routes/auth-routes';
import { CharacterRoutes } from '../routes/CharacterRoutes';
// import { AdventureRoutes } from '../routes/adventure-routes';

interface ApiGatewayProps {
  stage: string;
  lambdaFunctions: { [key: string]: lambda.Function };
}

export class ApiGateway extends Construct {
  public readonly api: apigw.RestApi;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    // API Gateway 생성
    this.api = new apigw.RestApi(this, 'DunPartyApi', {
      restApiName: 'dunparty-service',
      deployOptions: {
        stageName: props.stage,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // 라우트 설정
    // new AuthRoutes(this, 'AuthRoutes', {
    //   api: this.api,
    //   authFunction: props.lambdaFunctions.auth,
    // });

    new CharacterRoutes(this, 'CharacterRoutes', {
      api: this.api,
      characterFunction: props.lambdaFunctions.character,
    });

    // new AdventureRoutes(this, 'AdventureRoutes', {
    //   api: this.api,
    //   adventureFunction: props.lambdaFunctions.adventure,
    // });
  }
}