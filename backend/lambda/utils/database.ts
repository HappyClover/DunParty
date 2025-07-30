import { RDSDataService } from 'aws-sdk';

export class DatabaseService {
  private rds: RDSDataService;
  private secretArn: string;
  private clusterArn: string;
  private database: string;

  constructor() {
    this.rds = new RDSDataService({
      region: process.env.AWS_REGION || 'ap-northeast-2'
    });
    this.secretArn = process.env.DB_SECRET_ARN!;
    this.clusterArn = process.env.DB_CLUSTER_ARN!;
    this.database = process.env.DB_NAME || 'dunparty';

    if (!this.secretArn || !this.clusterArn) {
      throw new Error('DB_SECRET_ARN and DB_CLUSTER_ARN environment variables are required');
    }
  }

  async executeStatement(sql: string, parameters: any[] = [], transactionId?: string): Promise<any> {
    const params: RDSDataService.ExecuteStatementRequest = {
      secretArn: this.secretArn,
      resourceArn: this.clusterArn,
      database: this.database,
      sql,
      parameters: parameters.map(param => {
        if (typeof param === 'string') {
          return { value: { stringValue: param } };
        } else if (typeof param === 'number') {
          return { value: { longValue: param } };
        } else if (typeof param === 'boolean') {
          return { value: { booleanValue: param } };
        } else if (param === null || param === undefined) {
          return { value: { isNull: true } };
        } else {
          return { value: { stringValue: String(param) } };
        }
      }),
    };

    if (transactionId) {
      params.transactionId = transactionId;
    }

    try {
      const result = await this.rds.executeStatement(params).promise();
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async beginTransaction(): Promise<string> {
    const params = {
      secretArn: this.secretArn,
      resourceArn: this.clusterArn,
      database: this.database,
    };

    const result = await this.rds.beginTransaction(params).promise();
    return result.transactionId!;
  }

  async commitTransaction(transactionId: string): Promise<void> {
    const params = {
      secretArn: this.secretArn,
      resourceArn: this.clusterArn,
      transactionId,
    };

    await this.rds.commitTransaction(params).promise();
  }

  async rollbackTransaction(transactionId: string): Promise<void> {
    const params = {
      secretArn: this.secretArn,
      resourceArn: this.clusterArn,
      transactionId,
    };

    await this.rds.rollbackTransaction(params).promise();
  }
}