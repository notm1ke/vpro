import { EndpointController, isError } from '../src';

jest.setTimeout(45000);

beforeAll(() => {
    // Report test environment setup to console
    console.log(`Host: ${process.env.EMA_HOST}\n`
              + `Username: ${process.env.EMA_USER}\n`
              + `Password: ${process.env.EMA_PASSWORD}\n`);
})

describe('authentication', () => {
    test('should authenticate successfully', async () => {
        let controller = new EndpointController(process.env.EMA_HOST, process.env.EMA_USER, process.env.EMA_PASSWORD);
        let res = await controller.authenticate(true);
        
        expect(res).toBeInstanceOf(EndpointController);
    })
})

describe('endpoint retrieval', () => {
    test('should fetch endpoints', async () => {
        let controller = new EndpointController(process.env.EMA_HOST, process.env.EMA_USER, process.env.EMA_PASSWORD);
        await controller.authenticate(true);
        
        let endpoints = await controller.getEndpoints({ where: endpoint => endpoint.IsCiraConnected });
        if (isError(endpoints))
            throw new Error(endpoints.message);

        expect(endpoints.length).toBeGreaterThan(0);
    })

    test('should fetch endpoints where condition is met', async () => {
        let controller = new EndpointController(process.env.EMA_HOST, process.env.EMA_USER, process.env.EMA_PASSWORD);
        await controller.authenticate(true);
        
        let endpoints = await controller.getEndpoints({ where: endpoint => endpoint.IsCiraConnected });
        if (isError(endpoints))
            throw new Error(endpoints.message);

        expect(endpoints.length).toBeGreaterThan(0);
        expect(endpoints.filter(endpoint => endpoint.IsCiraConnected).length).toBe(endpoints.length);
    })

    test('should not find a nonexistent endpoint by name', async () => {
        let controller = new EndpointController(process.env.EMA_HOST, process.env.EMA_USER, process.env.EMA_PASSWORD);
        await controller.authenticate(true);
        
        let endpoint = await controller.getEndpointByName({ name: 'ABC123' });
        if (isError(endpoint))
            throw new Error(endpoint.message);

        expect(endpoint.length).toBe(0);
    })

    test('should not find a nonexistent endpoint by id', async () => {
        let controller = new EndpointController(process.env.EMA_HOST, process.env.EMA_USER, process.env.EMA_PASSWORD);
        await controller.authenticate(true);
        
        let endpoint = await controller.getEndpointById('ABC123');
        if (!isError(endpoint))
            throw new Error('Expected return of type ErrorResponse');

        expect(endpoint).toHaveProperty('message');
    })
})

describe('endpoint operations (out of band)', () => {
    test('should power off an endpoint', async () => {
        let controller = new EndpointController(process.env.EMA_HOST, process.env.EMA_USER, process.env.EMA_PASSWORD);
        await controller.authenticate(true);
        
        let endpoints = await controller.getEndpointByName({ name: '244XCS2' });
        if (isError(endpoints))
        throw new Error(endpoints.message);
        
        if (endpoints.length !== 1)
        throw new Error('Expected to find 1 endpoint, found ' + endpoints.length);
        
        let result = await controller.powerOff(endpoints[0].EndpointId);
        if (isError(result))
            throw new Error(result.message);

        expect(result).toEqual({ EndpointId: endpoints[0].EndpointId });
    })

    test('should power on an endpoint', async () => {    
        // Wait for shutdown to complete
        await new Promise(r => setTimeout(r, 10000));

        let controller = new EndpointController(process.env.EMA_HOST, process.env.EMA_USER, process.env.EMA_PASSWORD);
        await controller.authenticate(true);
        
        let endpoint = await controller.getEndpointByName({ name: '244XCS2' });
        if (isError(endpoint))
            throw new Error(endpoint.message);

        if (endpoint.length !== 1)
            throw new Error('Expected to find 1 endpoint, found ' + endpoint.length);

        let result = await controller.powerOn(endpoint[0].EndpointId);
        if (isError(result))
            throw new Error(result.message);

        expect(result).toEqual({ EndpointId: endpoint[0].EndpointId });
    })

    test('should hibernate an endpoint', async () => {
        // Wait for boot to complete
        await new Promise(r => setTimeout(r, 30000));

        let controller = new EndpointController(process.env.EMA_HOST, process.env.EMA_USER, process.env.EMA_PASSWORD);
        await controller.authenticate(true);
        
        let endpoint = await controller.getEndpointByName({ name: '244XCS2' });
        if (isError(endpoint))
            throw new Error(endpoint.message);

        if (endpoint.length !== 1)
            throw new Error('Expected to find 1 endpoint, found ' + endpoint.length);

        let result = await controller.hibernate(endpoint[0].EndpointId);
        if (isError(result))
            throw new Error(result.message);

        expect(result).toEqual({ EndpointId: endpoint[0].EndpointId });
    })
})