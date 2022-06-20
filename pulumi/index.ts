import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

const image = awsx.ecr.buildAndPushImage("signal-home-task", {
  context: "./app",
});

const role = new aws.iam.Role("lambdaRole", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: "lambda.amazonaws.com",
  }),
});

new aws.iam.RolePolicyAttachment("lambdaFullAccess", {
  role: role.name,
  policyArn: "arn:aws:iam::aws:policy/AWSLambda_FullAccess",
});

// Needed to write logs to Cloudwatch
new aws.iam.RolePolicyAttachment("lambdaBasicExeRole", {
  role: role.name,
  policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

const func = new aws.lambda.Function("translate", {
  packageType: "Image",
  imageUri: image.imageValue,
  role: role.arn,
  timeout: 60,
});
export const funcArn = pulumi.interpolate`${func.arn}`;

const funcUrl = new aws.lambda.FunctionUrl("translateUrl", {
  functionName: func.arn,
  // This causes a validation error from AWS
  // qualifier: "$LATEST",
  authorizationType: "NONE",
  cors: {
    allowCredentials: true,
    allowOrigins: ["*"],
    allowMethods: ["POST"],
    allowHeaders: ["date", "keep-alive"],
    exposeHeaders: ["keep-alive", "date"],
    maxAge: 86400,
  },
});
export const invokeUrl = pulumi.interpolate`${funcUrl.functionUrl}`;
