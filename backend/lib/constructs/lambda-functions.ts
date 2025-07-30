import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface DatabaseInfo {
  cluster: rds.DatabaseCluster;
  secret: secretsmanager.Secret;
  vpc: ec2.Vpc;
}

interface LambdaFunctionsProps {
  stage: string;
  database: DatabaseInfo;
}

export class LambdaFunctions extends Construct {
  public readonly functions: { [key: string]: lambda.Function };

  constructor(scope: Construct, id: string, props: LambdaFunctionsProps) {
    super(scope, id);

    const { database } = props;

    const commonProps = {
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(30),
      vpc: database.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      environment: {
        STAGE: props.stage,
        NEOPLE_API_KEY: process.env.NEOPLE_API_KEY || '',
        DB_SECRET_ARN: database.secret.secretArn,
        DB_CLUSTER_ARN: database.cluster.clusterArn,
        DB_NAME: 'dunparty',
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

    // Lambda에 데이터베이스 접근 권한 부여
    Object.values(this.functions).forEach(fn => {
      database.secret.grantRead(fn);
      database.cluster.grantDataApiAccess(fn);
    });
  }
}