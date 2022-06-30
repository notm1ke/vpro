import axios, { AxiosInstance } from 'axios';

import {
    ConditionalUrlParams,
    Endpoint,
    EndpointComputerNameFilterOptions,
    EndpointFilterOptions,
    EndpointHardware,
    ErrorResponse,
    HttpMethod,
    OAuthGrantPayload,
    RequireOne
} from './types';

export class EndpointController {
    
    private accessToken: string;
    private domainMode: boolean;
    private client: AxiosInstance;

    /**
     * Creates an instance of EndpointController.
     * 
     * @apiNote The account used to authenticate to the EMA server
     * should have the "Tenant Administrator" role in order to be
     * able to execute all of the operations this controller class
     * offers.
     * 
     * [View more information about permissions in the Intel Docs](https://www.intel.com/content/dam/support/us/en/documents/software/manageability-products/intel-ema-api-guide.pdf)
     * 
     * @example
     * let controller = new EndpointController({
     *     username: process.env.EMA_USERNAME,
     *     password: process.env.EMA_PASSWORD,
     * });
     * 
     * controller.authenticate(domainCredentials?, grantType?);
     * 
     * @param hostUrl the host url of the Intel EMA installation
     * @param username the username of the user to authenticate
     * @param password the password of the user to authenticate
     */
    constructor(hostUrl: string, private username: string, private password: string, private debug: boolean = false) {
        this.client = axios.create({
            baseURL: `${hostUrl.endsWith('/') ? hostUrl : hostUrl + '/'}api`,
        });
    }

    /**
     * Sends a POST request to the vPro EMA server to retrieve an access token.
     * 
     * @apiNote Please consult your Intel EMA administrator to see whether or
     * not your installation is configured to use Windows Domain Credentials,
     * or traditional OAuth-grant based authentication.
     * 
     * @param domainCredentials whether or not to use domain credentials mode
     */
    authenticate = async (domainCredentials: boolean, grantType?: 'password' | 'client_credentials'): Promise<EndpointController | ErrorResponse> => {
        let payload: OAuthGrantPayload = {
            Upn: this.username,
            Password: this.password,
            url: '/latest/accessTokens/getUsingWindowsCredentials',
        };

        if (!domainCredentials && !grantType)
            throw new Error('Cannot authenticate without a grant type when not using domain credentials mode.');

        if (domainCredentials && grantType)
            throw new Error('Cannot authenticate with both domain credentials and grant type.');

        if (!domainCredentials)
            payload = this.generateOAuthPayload(grantType);

        let auth = await this._authenticate(this, payload);

        this.domainMode = domainCredentials;
        this.client.defaults.headers['Authorization'] = `Bearer ${auth}`;
        
        return this;
    }

    private _authenticate = async (ctx: EndpointController, { url, ...payload }: OAuthGrantPayload): Promise<string | ErrorResponse> =>
        await ctx.client
            .post(url, payload)
            .then(res => res.data)
            .then(res => {
                if (!res.access_token || !('access_token' in res))
                    throw new Error('Could not retrieve access token');
                
                ctx.accessToken = res.access_token;
                return ctx.accessToken;
            });
        
    private generateOAuthPayload = (grantType: 'password' | 'client_credentials'): OAuthGrantPayload => {
        let url = '/token';
        if (grantType === 'password') return {
            url,
            username: this.username,
            password: this.password,
        };

        if (grantType === 'client_credentials') return {
            url,
            client_id: this.username,
            client_secret: this.password,
        };

        throw new Error('Invalid grant type');
    }

    private buildUrlParams = (urlBase: string, params: ConditionalUrlParams) => {
        let url = urlBase;
        if (params) {
            let query = Object
                .keys(params)
                .filter(key => !!params[key])
                .map(key => `${key}=${params[key]}`)
                .join('&');
            url += `?${query}`;
        }

        return url;
    }

    private exec = async <T, B = any>(method: HttpMethod, url: string, payload?: B): Promise<T | null> =>
        await this.client.request({ method, url, data: payload })
            .then(res => res.data && res.data as T)
            .catch(async err => {
                // Reauthenticate if the access token has expired
                if (err.response && err.response.status === 401) {
                    let auth = await this.authenticate(this.domainMode);
                    if ((auth as ErrorResponse).message)
                        return null;

                    return this.exec<T, B>(method, url, payload);
                }

                return null;
            });

    private log = (...args: any[]) => this.debug && console.log(...args);

    /**
     * Attempts to return endpoints that match the given filtering criteria.
     * 
     * @example
     * let all = await controller.getEndpoints();
     * let byGroup = await controller.getEndpoints({ groupId: ... });
     * let poweredOn = await controller.getEndpoints({ where: endpoint => endpoint.PowerState === 0 });
     * 
     * @param filterOptions the filter options to use when retrieving endpoints 
     */
    getEndpoints = async ({ groupId, where }: EndpointFilterOptions = {}): Promise<Endpoint[] | ErrorResponse> =>
        await this.exec<Endpoint[]>('GET', `/latest/endpoints${groupId ? `?endpointGroupId=${groupId}` : ''}`)
            .then(endpoints => where ? endpoints.filter(where) : endpoints);

    /**
     * Attempts to return the endpoint with a given computer name.
     * 
     * This can be useful if computer names are designated by centralized
     * tags, such as Dell Service Tags, or other identifiers such as a NetBIOS name.
     * 
     * @example
     * // For example, we can get an endpoint by their Dell Service Tag if that is the way the hostname is designated.
     * let endpoint = await controller.getEndpointByName('17NTDB2');
     * 
     * @param name the computer name of the endpoint to retrieve
     */
    getEndpointByName = async ({ name, contains, startsWith }: RequireOne<EndpointComputerNameFilterOptions>): Promise<Endpoint | ErrorResponse> =>
        await this.exec<Endpoint>('GET', this.buildUrlParams('/latest/endpoints',
            {
                computerName: name,
                computerNameContains: contains,
                computerNameStartsWith: startsWith
            }));

    /**
     * Attempts to retrieve an endpoint with a given ID.
     * 
     * Note, this ID corresponds to the internal ID that Intel EMA
     * assigns to the endpoint, not any identifying information from
     * the machine, or domain.
     * 
     * @param id the internal EMA ID of the endpoint to retrieve
     */
    getEndpointById = async (id: string): Promise<Endpoint | ErrorResponse> =>
        await this.exec<Endpoint>('GET', `/latest/endpoints/${id}`)
            .catch(err => {
                if (err.response && err.response.status === 404)
                    return null;

                throw err;
            });
    
    /**
     * Attempts to retrieve hardware information for a given endpoint.
     * @param id the internal EMA ID of the endpoint to retrieve
     */
    getEndpointHardware = async (id: string): Promise<EndpointHardware | ErrorResponse> =>
        await this.exec<EndpointHardware>('GET', `/latest/endpoints/${id}/HardwareInfoFromAmt`);

    /**
     * Attempts to delete an EMA endpoint using it's internal ID.
     * @param id the internal EMA ID of the endpoint to delete
     */
    removeEndpoint = async (id: string): Promise<boolean | ErrorResponse> =>
        await this.exec<boolean>('DELETE', `/latest/endpoints/${id}`);

}