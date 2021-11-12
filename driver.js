const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const sqs = new AWS.SQS();

const { Consumer } = require('sqs-consumer');

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/294356544435/packages.fifo';
const vendor1QueueUrl = 'https://sqs.us-west-1.amazonaws.com/294356544435/Test_Vendor_1';
const topic = 'arn:aws:sqs:us-west-1:294356544435:Test_Vendor_1';

const { v4: uuidv4 } = require('uuid');

const send = async (groupId, payload) => {
  return await sqs.sendMessage({
    MessageBody: `${payload}`,
    QueueUrl: vendor1QueueUrl
  }).promise();
}

const postDelivery = async () => {
  let payload = {
    Message : 'Sent from Driver',
    TopicArn: topic
  }

  try {
    console.log("In transit: ")
    let data = await send(uuidv4(), payload);
    console.log(JSON.stringify(data));
    console.log("---------------------------------------------");
  } catch(err) {
    console.log("ERROR::", err);
  }
}

const app = Consumer.create({
  queueUrl: queueUrl,
  pollingWaitTimeMs: 5000,
  handleMessage: (message) => {
    console.log("Received package from vendor")
    console.log(message);
    postDelivery();
  }
});

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();
// const getMessage = () => {
//   var params = {
//     QueueUrl: queueUrl,
//     AttributeNames: [
//       'All'
//     ],
//     MaxNumberOfMessages: 10,
//     //long polling to wait for request
//     WaitTimeSeconds: 10
//   };
//   sqs.receiveMessage(params, function(err, data) {
//     if(err) console.log(err, err.stack) 
//     else {
//       console.log(data);
//       getMessage();
//     }            
//   });
// }

// getMessage();

