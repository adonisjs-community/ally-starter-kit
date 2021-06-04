import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class YourDriverProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const Ally = this.app.container.resolveBinding('Adonis/Addons/Ally')
    const { YourDriver } = await import('../src/YourDriver')

    Ally.extend('yourdriver', (_, __, config, ctx) => {
      return new YourDriver(ctx, config)
    })
  }
}
