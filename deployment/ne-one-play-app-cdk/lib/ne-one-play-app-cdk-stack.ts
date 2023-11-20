import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apprunner from '@aws-cdk/aws-apprunner-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export interface NeOnePlayAppStackProps extends cdk.StackProps {
  envName: string
}


export class NeOnePlayAppCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: NeOnePlayAppStackProps) {
    super(scope, id, props);

    const envName = props.envName;
    let tagName = this.node.tryGetContext("tagName");
    if (!tagName) {
        tagName = envName;
    }

    const appContainerRepositoryName = new cdk.CfnParameter(this, "appContainerRepositoryName", {
      type: "String",
      description: "The Name of the Container repository for application."
  });

    const appService = new apprunner.Service(this, 'ne_one_play_app', {
        serviceName: "neoneplayapp_" + envName,
        source: apprunner.Source.fromEcr({
            imageConfiguration: {
                port: 3000,
            },
            repository: ecr.Repository.fromRepositoryName(this, "appImport", appContainerRepositoryName.valueAsString),
            tagOrDigest: tagName,      
            }),
        });
  }
}
