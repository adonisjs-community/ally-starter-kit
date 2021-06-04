<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of contents

- [Ally custom driver boilerplate](#ally-custom-driver-boilerplate)
  - [Getting started](#getting-started)
  - [How is the code structured?](#how-is-the-code-structured)
    - [YourDriverAccessToken](#yourdriveraccesstoken)
    - [YourDriverScopes](#yourdriverscopes)
    - [YourDriverConfig](#yourdriverconfig)
    - [YourDriver](#yourdriver)
  - [Development checklist](#development-checklist)
  - [Testing the driver](#testing-the-driver)
  - [Release checklist](#release-checklist)
  - [FAQ's](#faqs)
    - [How do I define extra params during redirect?](#how-do-i-define-extra-params-during-redirect)
    - [How do I define extra fields/params for the access token request?](#how-do-i-define-extra-fieldsparams-for-the-access-token-request)
  - [Share with others](#share-with-others)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Ally custom driver boilerplate

> A boilerplate for creating custom AdonisJS ally drivers

This repo serves as a starting point to create your custom OAuth2 drivers for [AdonisJS ally](https://docs.adonisjs.com/guides/auth/social).

The boilerplate is tailored to create one driver per project and publish it as a package on npm.

## Getting started

Following are the steps to get started.

- Fork this repo and then clone it on your local machine.
- Install all the dependencies using `npm` or `yarn` (whatever you prefer).
- Open `package.json` file and update the package `name`, `description` and the `adonisjs` configuration block.

  ```json
  {
    "name": "package-name",
    "description": "",
    "adonisjs": {
      "types": "package-name",
      "providers": ["package-name"]
    }
  }
  ```

## How is the code structured?

The code for the driver is inside the `src` directory. Make sure to change the `YourDriver` directory name to the name of the driver.

The driver implementation is mainly driven by the config, except the `user` and the `userFromToken` methods. Both of these methods are specific to the Oauth provider, and hence you have to implement them yourself.

The `src/YourDriver/index.ts` file has the following exports.

#### YourDriverAccessToken

The type defines the properties that exist on the access token returned by your driver. You must read your OAuth provider documentation and list all the properties here.

**Do not change the pre-defined `token` and `bearer` properties.**

```ts
export type YourDriverAccessToken = {
  token: string
  type: 'bearer'
}
```

#### YourDriverScopes

Define a union of driver scopes accepted by your OAuth provider. You can check out the [official implementations](https://github.com/adonisjs/ally/blob/develop/adonis-typings/ally.ts#L236-L268) to see how they are defined.

#### YourDriverConfig

The type defines the configuration options that your driver expects. It must specify the following mentioned properties, along with any additional properties your driver needs to be functional.

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

The driver implementation is a standard TypeScript class that extends the base `Oauth2Driver` class. The base driver class enforces you to define the following instance properties.

- `authorizeUrl` is the URL for the redirect request. The user is redirected to this URL to authorize the request. Check out provider docs to find this URL.
- `accessTokenUrl` is used to exchange the authorization code for the access token. Check out provider docs to find this URL.
- `userInfoUrl` is used to make a request for getting the user profile information
- `codeParamName` is the query string parameter for reading the **authorization code** after redirecting the user back to the callback URL.
- `errorParamName` is the query string parameter for finding the error after redirecting the user back to the callback URL.
- `stateCookieName` is the cookie name for storing the CSRF token (also known as the state). Make sure the cookie name does not collide with other drivers. A safer option is to prefix your driver name to the `oauth_state` keyword.
- `stateParamName` is the query string parameter name for setting the state during the authorization redirect.
- `scopeParamName` is the query string parameter name for sending the scopes during the authorization redirect.
- `scopesSeparator` is the character to use for separating multiple parameters.

## Development checklist

- [ ] I have renamed all `YourDriver` references to a more meaningful driver name inside the `src/YourDriver/index.ts` file.
- [ ] I have renamed the `YourDriverProvider` inside the `providers/index.ts` file.
- [ ] I have updated the driver name in the `Ally.extend` method call inside the `providers/index.ts` file.
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
- [ ] I have updated the `standalone.ts` file to export the renamed driver file name.

## Testing the driver

You can test the driver by installing it locally inside your AdonisJS application. Following are the steps you need to perform.

- Compile the TypeScript code to JavaScript using the `npm run build` script.
- `cd` into your AdonisJS project and install the package locally using `npm i path/to/your/driver/package`.
- Run `node ace configure <package-name>`. The configure command needs the package name and not the package path.
- Inform typescript about your driver by defining a mapping inside the `contracts/ally.ts` file.

  ```ts
  import { YourDriverConfig, YourDriver } from 'ally-custom-driver/build/standalone'

  interface SocialProviders {
    yourDriver: {
      config: YourDriverConfig
      implementation: YourDriver
    }
  }
  ```

- Define the config inside the `config/ally.ts` file.
- And now you can use your driver like any other inbuilt driver.

## Release checklist

Make sure to finish the following tasks before releasing your package.

- [ ] I have renamed the `name` and `description` properties inside the `package.json` file.
- [ ] I have renamed the `adonisjs.types` and `adonisjs.providers` properties to use the package name inside the `package.json` file.
- [ ] I have updated the post-install instructions inside the `instructions.md` file.
- [ ] I have updated the `adonisjs.env` property inside the `package.json` file to use the correct driver name for environment variables.

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

Are you excited about sharing your work with others? Make sure to submit your package to the [awesome-adonisjs](https://github.com/adonisjs-community/awesome-adonisjs) repo.
