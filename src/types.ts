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

export type NoopResponse = {
    EndpointId: string;
}

export type AmtSetupResponse = {
    AmtSetupId: string;
    Type: string;
    PID: string;
    Creation: string;
    SetsRandomMebxPassword: boolean;
    Profile: AmtSetupProfile;
    State: string;
    StateString: string;
    ExtraAmtInfo: AmtSetupExtraInfo;
    AmtProfileId: number;
    SetsRandomAdminPassword: boolean;
}

export type AmtSetupProfile = {
    UsesTLS: boolean;
    UsesCIRA: boolean;
    UsesEmaAccount: boolean;
    CiraIntranetSuffix: string;
    AdminPassword: string;
    MebxPasswordState: string;
    ProvisionCertificateHash: string;
    ProvisioningDnsSuffix: string;
    PPS: string;
}

export type AmtSetupExtraInfo = {
    LastUpdated: string;
    HECIDriver: AmtSetupComponentStatus;
    CorporateDNS: AmtSetupComponentStatus;
    CorporateVPN: AmtSetupComponentStatus;
    IntelNic: AmtSetupComponentStatus;
}

export type AmtSetupComponentStatus = {
    Name: string;
    Status: boolean;
    Details: string;
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

export type EmaTenant = {
    CreatedBy: string;
    CreatedOn: string;
    TenantId: string;
    ModifiedBy: string;
    ModifiedOn: string;
    Description: string;
    Name: string;
}

export type EmaUser = {
    UserId: string;
    Username: string;
    Enabled: boolean;
    TenantId: string;
    Description: string;
    RoleId: number;
    SysRole: string;
}

export type EmaUserGroup = {
    UserGroupId: number;
    Name: string;
    TenantId: string;
    Description: string;
    CreatedOn: string;
    CreatedBy: string;
    ModifiedOn: string;
    ModifiedBy: string;
    RoleId: number;
    AccessRightsId: string;
    AccessRights: string;
}

export type EmaUserGroupMembership = {
    UserName: string;
}

export type EmaUserGroupMembers = EmaUserGroupMembership[];