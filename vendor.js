'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const sqs = new AWS.SQS();
const { Consumer } = require('sqs-consumer');

const faker = require('faker');
const { v4: uuidv4 } = require('uuid');

const topic = 'arn:aws:sqs:us-west-1:294356544435:packages.fifo';
const queueUrl = 'https://sqs.us-west-1.amazonaws.com/294356544435/packages.fifo';
let vendorlQueueUrl = 'https://sqs.us-west-1.amazonaws.com/294356544435/Test_Vendor_1';

const send = async (groupId, payload) => {
  return await sqs.sendMessage({
    MessageGroupId: `group-${groupId}`,
    MessageDeduplicationId: `m-${groupId}-${payload.orderID}`,
    MessageBody: `${payload}`,
    QueueUrl: queueUrl
  }).promise();
}

setInterval(async () => {
  postPickup();
}, 4000);

const postPickup = async () => {
  let payload = {
    vendorID: topic,
    orderID: uuidv4(),
    customer: faker.name.findName(),
    Message : 'Sent from Vendor',
    TopicArn: topic
  }

  try {
    let data = await send(uuidv4(), payload);
    console.log("Sending package: ")
    console.log(JSON.stringify(data));
    console.log("---------------------------------------------");
  } catch(err) {
    console.log("ERROR::", err);
  }
}

const app = Consumer.create({
  queueUrl: vendorlQueueUrl,
  pollingWaitTimeMs: 5000,
  handleMessage: (message) => {
    console.log("Delivery completed:", message);
  }
});

app.start();