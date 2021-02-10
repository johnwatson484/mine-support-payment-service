const { createSchedule } = require('../schedule')
const sendEvent = require('../events')

async function processScheduleMessage (message, receiver) {
  try {
    const scheduleStartDate = new Date()
    await createSchedule(message.body, scheduleStartDate)
    await sendEvent(message.body, 'uk.gov.demo.claim.payment.scheduled')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processScheduleMessage
