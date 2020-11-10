import { HttpStatusError } from 'common-errors'
import { ActionTransport, PLUGIN_STATUS_FAIL } from '@microfleet/utils'
import { Microfleet, HealthStatus } from '@microfleet/core'
import type { ServiceRequest } from '@microfleet/core-types'

const kUnhealthy = new HttpStatusError(500, 'unhealthy')

async function genericHealthCheck(this: Microfleet, request: ServiceRequest): Promise<{ data: HealthStatus }> {
  const data = await this.getHealthStatus()

  if (PLUGIN_STATUS_FAIL === data.status) {
    switch (request.transport) {
      case 'amqp':
      case 'internal': {
        const plugins = data.failed.map((it) => it.name).join(', ')
        throw new HttpStatusError(500, `Unhealthy due to following plugins: ${plugins}`)
      }

      default:
        throw kUnhealthy
    }
  }

  return { data }
}

// to avoid 'setTransportAsDefault: false' and make things obvious
genericHealthCheck.transports = [
  ActionTransport.http,
  ActionTransport.amqp,
  ActionTransport.internal,
  ActionTransport.socketio,
]

export default genericHealthCheck
