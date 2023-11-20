import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export interface NeOnePlayStackProps extends cdk.StackProps {
  envName: string
}


export class NeOnePlayCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: NeOnePlayStackProps) {
    super(scope, id, props);

    const envName = props.envName;
    const appRepository = new ecr.Repository(this, 'ne-one-play-app-' + envName, {
        repositoryName: "ne-one-play-app-" + envName,
        imageScanOnPush: true,
    });

    const appRepositoryName = new cdk.CfnOutput(this, 'appRepositoryName', {
        value: appRepository.repositoryName
    });

    const appRepositoryUri = new cdk.CfnOutput(this, 'appRepositoryUri', {
        value: appRepository.repositoryUri,
    });
  }
}
