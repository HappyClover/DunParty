import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface DatabaseProps {
  stage: string;
  vpc?: ec2.Vpc;
}

export class Database extends Construct {
  public readonly cluster: rds.DatabaseCluster;
  public readonly secret: secretsmanager.Secret;
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id);

    // VPC 생성 (기존 VPC가 없는 경우)
    this.vpc = props.vpc || new ec2.Vpc(this, 'DunPartyVpc', {
      maxAzs: 2,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'Database',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // 데이터베이스 자격 증명 생성
    this.secret = new secretsmanager.Secret(this, 'DatabaseCredentials', {
      secretName: `dunparty-db-credentials-${props.stage}`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: 'admin',
        }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\\'',
      },
    });

    // 보안 그룹
    const securityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for Aurora Serverless v2',
      allowAllOutbound: false,
    });

    // Lambda에서 DB 접근 허용
    securityGroup.addIngressRule(
      ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
      ec2.Port.tcp(3306),
      'Allow MySQL access from VPC'
    );

    // Aurora Serverless v2 클러스터 생성 - 수정된 엔진 버전
    this.cluster = new rds.DatabaseCluster(this, 'AuroraCluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.of('8.0.mysql_aurora.3.04.0', '8.0'),
      }),
      clusterIdentifier: `dunparty-cluster-${props.stage}`,
      credentials: rds.Credentials.fromSecret(this.secret),
      defaultDatabaseName: 'dunparty',
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [securityGroup],
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: props.stage === 'prod' ? 4 : 1,
      writer: rds.ClusterInstance.serverlessV2('writer', {
        publiclyAccessible: false,
      }),
      readers: [
        rds.ClusterInstance.serverlessV2('reader', {
          scaleWithWriter: true,
          publiclyAccessible: false,
        }),
      ],
      backup: {
        retention: props.stage === 'prod' ? cdk.Duration.days(7) : cdk.Duration.days(1),
        preferredWindow: '03:00-04:00',
      },
      deletionProtection: props.stage === 'prod',
      removalPolicy: props.stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      
      // Data API 활성화 (Lambda에서 RDS Data API 사용)
      enableDataApi: true,
    });

    // 출력값
    new cdk.CfnOutput(this, 'ClusterEndpoint', {
      value: this.cluster.clusterEndpoint.hostname,
      description: 'Aurora Cluster Endpoint',
    });

    new cdk.CfnOutput(this, 'ClusterReadEndpoint', {
      value: this.cluster.clusterReadEndpoint.hostname,
      description: 'Aurora Cluster Read Endpoint',
    });

    new cdk.CfnOutput(this, 'SecretArn', {
      value: this.secret.secretArn,
      description: 'Database Secret ARN',
    });
  }
}