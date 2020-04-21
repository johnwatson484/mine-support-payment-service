const { scheduleMessageAction } = require('./actions/schedule-message-action')
const { paymentMessageAction } = require('./actions/payment-message-action')
const MessageConsumer = require('./sqs/message-consumer')
const createQueue = require('./sqs/create-queue')
const config = require('../../config')
let scheduleConsumer
let paymentConsumer

async function registerService () {
  if (config.scheduleQueueConfig.createQueue) {
    await createQueue(config.scheduleQueueConfig.name, config.scheduleQueueConfig)
  }
  if (config.paymentQueueConfig.createQueue) {
    await createQueue(config.paymentQueueConfig.name, config.paymentQueueConfig)
  }
  registerScheduleConsumer()
  registerPaymentConsumer()
}

function registerScheduleConsumer () {
  scheduleConsumer = new MessageConsumer(config.scheduleQueueConfig, config.scheduleQueueConfig.queueUrl, scheduleMessageAction)
  scheduleConsumer.start()
}

function registerPaymentConsumer () {
  paymentConsumer = new MessageConsumer(config.paymentQueueConfig, config.paymentQueueConfig.queueUrl, paymentMessageAction)
  paymentConsumer.start()
}

function isRunning () {
  return !scheduleConsumer.stopped && !paymentConsumer.stopped
}

process.on('SIGTERM', async function () {
  await closeConnections()
  process.exit(0)
})

process.on('SIGINT', async function () {
  await closeConnections()
  process.exit(0)
})

async function closeConnections () {
  scheduleConsumer.stop()
  paymentConsumer.stop()
}

module.exports = {
  registerService,
  closeConnections,
  isRunning
}