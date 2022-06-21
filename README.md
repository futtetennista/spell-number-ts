# README

## Build the code

```bash
$ yarn
$ cd app
$ yarn build
```

## Run the code locally

Run `yarn build` from the root of the project. This compiles the typescript files and copies
them in the folder with the `Dockerfile`. Now build the docker image either manually

```bash
$ docker build -t <image-tag> docker
```

or using pulumi (see below). To create a container and send requests simply run

```bash
# In one terminal
$ docker run -p 9000:8080 --rm <image>
# In another terminal
$ curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"number": "99"}'
```

See also: https://hub.docker.com/r/amazon/aws-lambda-nodejs.

## Deploy on AWS

- setup AWS either with AWS CLI or by providing the necessary
  environment variables by renaming `.envrc.template` to `.envrc` and
  entering your credentials. By leveraging `direnv` those environment variables
  will be set up for you when you enter the folder.
- [setup pulumi](https://www.pulumi.com/registry/packages/aws/installation-configuration/) to
  work with AWS

```bash
# In the root folder of the project
$ yarn build
$ pulumi up
>>> Please choose a stack, or create a new one: signal
>>> Previewing update (signal)
>>>
>>>      Type                       Name                                      Plan       Info
>>>      pulumi:pulumi:Stack        home-task-signal
>>>      ├─ awsx:ecr:Repository     signal-home-task                                     1 warning
>>>  +   ├─ aws:lambda:Function     aws_lambda_function.signal.translate      create
>>>  +   └─ aws:lambda:FunctionUrl  aws_lambda_function_url.signal.translate  create
>>> Outputs:
>>>   + funcArn  : output<string>
>>>   + invokeUrl: output<string>
>>>
>>> Do you want to perform this update?

# Look at the changes and all looks fine, select yes

>>> Outputs:
>>>   + funcArn  : "arn:aws:lambda:eu-west-1:000000000000:function:translate-bde4684"
>>>   + invokeUrl: "https://<some-random-subdomain>.lambda-url.eu-west-1.on.aws/"
>>>
>>> Resources:
>>>     + 9 created

# Test the lambda function
$ curl "https://<some-random-subdomain>.lambda-url.eu-west-1.on.aws" -d '{"number": "99"}'
```
## Using the live API

There's an API deployed on AWS Lambda reachable at `https://3aorw4lzp6nyoug4rgdsryoe3e0ikaof.lambda-url.eu-west-1.on.aws`
and you can try it using `curl`

```bash
curl https://3aorw4lzp6nyoug4rgdsryoe3e0ikaof.lambda-url.eu-west-1.on.aws -d '{"number":"123"}
'
>>> {"result":"one hundred and twenty-three"}
```

## Request

The API supports numbers

```json
{ "number": 1000 }
```
or string

```json
{ "number": "1000" }
```
