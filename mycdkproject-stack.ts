import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class MycdkprojectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

   
    const vpc = new ec2.Vpc(this, 'toktamVPC', {
      cidr: '10.30.0.0/16',
      maxAzs: 3 
    });

   
    const instance = new ec2.Instance(this, 'toktamEC2', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      }
      
    });

    
    const queue = new sqs.Queue(this, 'toktamQueue', {
      visibilityTimeout: cdk.Duration.seconds(300) 
    });

   
    const topic = new sns.Topic(this, 'toktamTopic');

   
    const secret = new secretsmanager.Secret(this, 'toktamSecret', {
      secretName: 'metrodb-secrets',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: '', password: '' }),
        excludePunctuation: true,
        includeSpace: false,
        generateStringKey: 'password',
        passwordLength: 12 
      }
    });

    
    new cdk.CfnOutput(this, 'VPCId', { value: vpc.vpcId });
    new cdk.CfnOutput(this, 'EC2InstanceId', { value: instance.instanceId });
    new cdk.CfnOutput(this, 'QueueUrl', { value: queue.queueUrl });
    new cdk.CfnOutput(this, 'TopicArn', { value: topic.topicArn });
    new cdk.CfnOutput(this, 'SecretName', { value: secret.secretName });
  }
}
