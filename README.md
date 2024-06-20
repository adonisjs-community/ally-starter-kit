# Ally driver boilerplate
> A boilerplate for creating custom AdonisJS Ally drivers

This repo is a starting point to create your custom OAuth2 drivers for [AdonisJS ally](https://docs.adonisjs.com/guides/authentication/social-authentication).

The boilerplate is tailored to create one driver per project and publish it as a package on npm.

## Getting started

Following are the steps to get started.

- Fork this repo and then clone it on your local machine.
- Install all the dependencies using `npm`, `pnpm`, or `yarn` (whatever you prefer).
- Open the `package.json` file and update the `name`, `description`, and the `author` details.

  ```json
  {
    "name": "ally-custom-service",
    "description": "Starter kit to create an Ally driver for an OAuth2 service",
    "author": ""
  }
  ```

## How is the code structured?

The code for the driver is inside the `src` directory. Make sure to change the `YourDriver` keyword references inside the `src/driver.ts` file with the service name for which you are creating the driver. For example, Change `YourDriver` to `AppleDriver` or `InstagramDriver`.

The driver implementation is mainly driven by the config, except for the `user` and the `userFromToken` methods. Both of these methods are specific to the Oauth provider, so you have to implement them yourself.

The `src/driver.ts` file has the following exports.

#### YourDriverAccessToken

The type defines the properties on the access token returned by the driver. You must read your OAuth provider documentation and list all the properties here.

**Do not change the pre-defined `token` and `bearer` properties.**

```ts
export type YourDriverAccessToken = {
  token: string
  type: 'bearer'
}
```

#### YourDriverScopes

Define a union of driver scopes accepted by your OAuth provider. You can check out the [official implementations](https://github.com/adonisjs/ally/blob/next/src/types.ts#L237) to see how they are defined.

#### YourDriverConfig

The type defines the configuration options that your driver expects. It must specify the following properties and any additional properties your driver needs to be functional.

```ts
export type YourDriverConfig = {
  driver: 'YourDriverName'
  clientId: string
  clientSecret: string
  callbackUrl: string
  authorizeUrl?: string
  accessTokenUrl?: string
  userInfoUrl?: string
}
```

#### YourDriver

The driver implementation is a standard TypeScript class that extends the base `Oauth2Driver` class. The base driver class forces you to define the following instance properties.

- `authorizeUrl` is the URL for the redirect request. The user is redirected to this URL to authorize the request. Check out provider docs to find this URL.
- `accessTokenUrl` is used to exchange the authorization code for the access token. Check out provider docs to find this URL.
- `userInfoUrl` is used to get the user profile information.
- `codeParamName` is the query string parameter for reading the **authorization code** after redirecting the user back to the callback URL.
- `errorParamName` is the query string parameter for finding the error after redirecting the user to the callback URL.
- `stateCookieName` is the cookie name for storing the CSRF token (also known as the state). Make sure the cookie name does not collide with other drivers. A safer option is to prefix the driver name followed by the `oauth_state` keyword.
- `stateParamName` is the query string parameter name for setting the state during the authorization redirect.
- `scopeParamName` is the query string parameter name for sending the scopes during the authorization redirect.
- `scopesSeparator` is the character used for separating multiple parameters.

#### YourDriverService
A factory function to reference the driver within the `config/ally.ts` file of an AdonisJS application. For example:

```ts
import { YourDriverService } from 'your-package-name'

defineConfig({
  github: YourDriverService({
    clientId: env.get('GITHUB_CLIENT_ID')!,
    clientSecret: env.get('GITHUB_CLIENT_SECRET')!,
    callbackUrl: '',
  }),
})
```

## Development checklist

- [ ] I have renamed all `YourDriver` references to a more meaningful name inside the `src/driver.ts` file.
- [ ] I have defined the `authorizeUrl` class property.
- [ ] I have defined the `accessTokenUrl` class property.
- [ ] I have defined the `userInfoUrl` class property.
- [ ] I have defined the `codeParamName` class property.
- [ ] I have defined the `errorParamName` class property.
- [ ] I have defined the `stateCookieName` class property.
- [ ] I have defined the `stateParamName` class property.
- [ ] I have defined the `scopeParamName` class property.
- [ ] I have defined the `scopesSeparator` class property.
- [ ] I have implemented the `accessDenied` class method.
- [ ] I have implemented the `user` class method.
- [ ] I have implemented the `userFromToken` class method.

## Testing the driver

You can test the driver by installing it locally inside your AdonisJS application. Following are the steps you need to perform.

- Compile the TypeScript code to JavaScript using the `npm run build` script.
- `cd` into your AdonisJS project and install the package locally using `npm i path/to/your/driver/package`.
- Finally, reference the driver using the `YourDriverService` factory function inside the `config/ally.ts` file.

## FAQ's

### How do I define extra params during redirect?

You can configure the redirect request by implementing the `configureRedirectRequest` method on the driver class. The method is already pre-defined and commented out.

```ts
protected configureRedirectRequest(request: RedirectRequest<YourDriverScopes>) {
  request.param('key', 'value')
}
```

### How do I define extra fields/params for the access token request?

You can configure the access token request by implementing the `configureAccessTokenRequest` method on the driver class. The method is already pre-defined and commented out.

```ts
protected configureAccessTokenRequest(request: ApiRequest) {
  // Request body
  request.field('key', 'value')

  // Query param
  request.param('key', 'value')
}
```

## Share with others

Are you excited about sharing your work with others? Submit your package to the [awesome-adonisjs](https://github.com/adonisjs-community/awesome-adonisjs) repo.
