'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });

const sns = new AWS.SNS();

const topic = 'arn:aws:sqs:us-west-1:294356544435:packages.fifo'

const payload = {
  message: 'foobar',
  topic: topic
};

sns.publish(payload).promise()
  .then(data => {
    console.log(data)
  }).catch(err => {
    console.log(err);
  });