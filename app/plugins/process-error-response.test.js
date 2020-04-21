describe('Process Error plugin tests', () => {
  const processErrorResponse = require('./process-error-response')

  test('processErrorResponse returns 404 response', async (done) => {
    const request = {
      response: {
        output: {
          statusCode: 404
        }
      }
    }

    const response = processErrorResponse(request)
    expect(response).toStrictEqual(request.response)
    done()
  })

  test('processErrorResponse returns 404 response', async (done) => {
    const request = {
      response: {
        output: {
          statusCode: 500
        }
      },
      log: function (message, data) {}
    }

    const response = processErrorResponse(request)
    expect(response).toStrictEqual(request.response)
    done()
  })
})