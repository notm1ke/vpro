import { EndpointController, isError } from '../src';

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
        if (isError(endpoint))
            throw new Error(endpoint.message);

        expect(endpoint).toBeNull();
    })
})

describe('endpoint operations (out of band)', () => {
    test('should power on an endpoint', async () => {
        let controller = new EndpointController(process.env.EMA_HOST, process.env.EMA_USER, process.env.EMA_PASSWORD);
        await controller.authenticate(true);
        
        let endpoint = await controller.getEndpointByName({ name: 'ABC123' });
        if (isError(endpoint))
            throw new Error(endpoint.message);

        // let res = await controller.powerStateOn(endpoint[0].Id);
        // if (isError(res))
        //     throw new Error(res.message);

        // expect(res).toBe(true);
        throw new Error('not implemented yet');
    })
})