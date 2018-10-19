import assert = require('assert')
import { NotFoundError } from 'common-errors'
import { Microfleet, PluginTypes } from '../'
import _require from '../utils/require'
import retry = require('bluebird-retry')

export const name = 'knex'
export const type = PluginTypes.database
export function attach(this: Microfleet, config: any = {}) {
  const factory = _require('knex')
  const service = this

  assert(service.hasPlugin('logger'), new NotFoundError('log module must be included'))
  assert(service.hasPlugin('validator'), new NotFoundError('validator module must be included'))

  service.ifError('knex', config)
  service.ifError(`knex.${config.client}`, config)

  const knex = service.knex = factory(config)

  const establishConnection = async () => {
    const result = await knex.raw('SELECT TRUE;')
    assert.equal(result.rows[0].bool, true)
  }

  return {
    async connect() {
      await retry(establishConnection, {
        interval: 500,
        backoff: 2,
        max_interval: 5000,
        timeout: 60000,
        max_tries: 100,
      })

      service.addMigrator('knex', () => knex.migrate.latest())
      service.emit('plugin:connect:knex', knex)

      return knex
    },

    async close() {
      await knex.destroy()
      service.emit('plugin:close:knex')
    },
  }
}
