export type OAuthPasswordGrantPayload = {
    username: string;
    password: string;
}

export type OAuthClientCredentialsGrantPayload = {
    client_id: string;
    client_secret: string;
}

export type OAuthDomainCredentialsPayload = {
    Upn: string;
    Password: string;
}

export type OAuthGrantPayload = (OAuthPasswordGrantPayload | OAuthClientCredentialsGrantPayload | OAuthDomainCredentialsPayload) & {
    url: string;
};

export type AccessToken = {
    accessToken: string;
}

export type Endpoint = {
    EndpointId: string;
    EndpointGroupId: string;
    EndpointGroupName: string;
    LastUpdate: string;
    MEVersion: string;
    ComputerName: string;
    PlatformType: number;
    AgentVersion: number;
    AgentIdentifier: number;
    MEFWBuildNumber: number;
    PowerState: number;
    PowerStateUpdate: string;
    IsConnected: boolean;
    NodeIdentity: number;
    IsAmtVersionValid: boolean;
    AmtControlMode: number;
    AmtProvisioningState: number;
    AmtProvisioningMode: number;
    IsCiraConnected: boolean;
}

export type EndpointHardware = {
    AmtPlatformInfo: {
        ComputerModel: string;
        ManufacturerName: string;
        SerialNumber: string;
        VersionNumber: string;
        SystemId: string;
    }
    AmtBaseBoardInfo: {
        ManufacturerName: string;
        ProductName: string;
        VersionNumber: string;
        SerialNumber: string;
        AssetTag: string;
        IsReplaceable: boolean;
    }
    AmtBiosInfo: {
        ManufacturerName: string;
        VersionNumber: string;
        ReleaseDate: string;
    }
    AmtProcessorInfo: ProcessorInfo[];
    AmtMemoryModuleInfo: MemoryModuleInfo[];
    AmtStorageMediaInfo: StorageMediaInfo[];
}

type ProcessorInfo = {
    ManufacturerName: string;
    Version: string;
    MaxClockSpeedInGHz: number;
    Status: string;
}

type MemoryModuleInfo = {
    BankLabel: string;
    ManufacturerName: string;
    SerialNumber: string;
    Size: number;
    FormFactor: string;
    MemoryType: string;
    AssetTag: string;
    PartNumber: string;
}

type StorageMediaInfo = {
    Model: string;
    SerialNumber: string;
    MaxMediaSize: number;
}

export interface EmaError extends Error {
    code: number;
}

export type ErrorResponse = {
    message: string;
    code: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ConditionalUrlParams = {
    [key: string]: string | number | boolean;
}

export type RequireOne<T> = {
    [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T];

export type EndpointFilterOptions = {
    groupId?: string;
    where?: (endpoint: Endpoint) => boolean;
}

export type EndpointComputerNameFilterOptions = {
    name?: string;
    contains?: string;
    startsWith?: string;
}