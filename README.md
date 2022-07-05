# Intel(R) vPro API Wrapper

![version badge](https://img.shields.io/github/package-json/v/notm1ke/vpro?color=2573bc)
![vuln badge](https://img.shields.io/snyk/vulnerabilities/github/notm1ke/vpro)

This is a TypeScript wrapper for the Intel(R) vPro API provided via the EMA platform.

## Installation

Use npm to install this project.

```bash
npm install vpro
```

## Usage

```ts
import { EndpointController, isError } from 'vpro';

// Instantiate your vPro Controller instance
let controller = new EndpointController(host, username, password);

// Authenticate with the API
let auth = await controller.authenticate(useDomainCredentials: boolean, grant_type?: 'password' | 'client_credentials');
if (isError(auth)) return null;

// Perform operations on your endpoints
let endpoints = await controller.getEndpoints({ where: endpoint => ... });
if (isError(endpoints)) return null;

...
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Testing
In order to use the builtin Jest tests, you must rename the provided ``jest.setup-example.js`` to ``jest.setup.js`` and replace the example values with your test credentials.

## License
[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)