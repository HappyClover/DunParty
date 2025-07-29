import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface CharacterRoutesProps {
  api: apigw.RestApi;
  characterFunction: lambda.Function;
}

export class CharacterRoutes extends Construct {
  constructor(scope: Construct, id: string, props: CharacterRoutesProps) {
    super(scope, id);

    const { api, characterFunction } = props;
    const integration = new apigw.LambdaIntegration(characterFunction);

    // /character
    const characterResource = api.root.addResource('character');
    characterResource.addMethod('GET', integration); // ?? ??
    characterResource.addMethod('POST', integration); // ?? ??

    // /character/{characterId}
    const characterIdResource = characterResource.addResource('{characterId}');
    characterIdResource.addMethod('GET', integration); // ?? ??
    characterIdResource.addMethod('PUT', integration); // ?? ??
    characterIdResource.addMethod('DELETE', integration); // ?? ??

    // /character/{characterId}/adventures
    const adventuresResource = characterIdResource.addResource('adventures');
    adventuresResource.addMethod('GET', integration); // ????? ???
  }
}