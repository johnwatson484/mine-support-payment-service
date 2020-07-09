
const config = require('../../../server/config')
const scheduleMessageAction = require('../../../server/services/schedule-message-action')
const paymentMessageAction = require('../../../server/services/payment-message-action')

const MessageReceiver = require('../../../server/services/messaging/message-receiver')
jest.mock('../../../server/services/messaging/message-receiver')

describe('message service', () => {
  test('registerReceivers creates and starts receivers for schedule and payment queues with correct configs', async () => {
    const messageService = require('../../../server/services/message-service')
    await messageService.registerReceivers()
    // expect receives to be created
    expect(MessageReceiver).toHaveBeenCalledTimes(2)
    expect(MessageReceiver).toHaveBeenCalledWith('schedule-queue-receiver', config.scheduleQueueConfig)
    expect(MessageReceiver).toHaveBeenCalledWith('payment-queue-receiver', config.paymentQueueConfig)
    // expect receives to be started
    const scheduleReceiveInstance = MessageReceiver.mock.instances[0]
    expect(scheduleReceiveInstance.openConnection).toHaveBeenCalledTimes(1)
    expect(scheduleReceiveInstance.setupReceiver).toHaveBeenCalledWith(scheduleMessageAction)
    const paymentReceiveInstance = MessageReceiver.mock.instances[1]
    expect(paymentReceiveInstance.openConnection).toHaveBeenCalledTimes(1)
    expect(paymentReceiveInstance.setupReceiver).toHaveBeenCalledWith(paymentMessageAction)
  })

  test('isRunning returns true if receives are both running', async () => {
    const messageService = require('../../../server/services/message-service')
    await messageService.registerReceivers()
    const scheduleReceiveInstance = MessageReceiver.mock.instances[0]
    const paymentReceiveInstance = MessageReceiver.mock.instances[1]
    scheduleReceiveInstance.isConnected.mockReturnValue(true)
    paymentReceiveInstance.isConnected.mockReturnValue(true)
    expect(messageService.isRunning()).toEqual(true)
  })

  test('isRunning returns false if a receive connection is closed', async () => {
    const messageService = require('../../../server/services/message-service')
    await messageService.registerReceivers()
    const scheduleReceiveInstance = MessageReceiver.mock.instances[0]
    const paymentReceiveInstance = MessageReceiver.mock.instances[1]
    scheduleReceiveInstance.isConnected.mockReturnValue(false)
    paymentReceiveInstance.isConnected.mockReturnValue(true)
    expect(messageService.isRunning()).toEqual(false)
  })

  test('close connections calls closeConnection on both receivers', async () => {
    const messageService = require('../../../server/services/message-service')
    await messageService.registerReceivers()
    await messageService.closeConnections()
    const scheduleReceiveInstance = MessageReceiver.mock.instances[0]
    expect(scheduleReceiveInstance.closeConnection).toHaveBeenCalledTimes(1)
    const paymentReceiveInstance = MessageReceiver.mock.instances[1]
    expect(paymentReceiveInstance.closeConnection).toHaveBeenCalledTimes(1)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
})