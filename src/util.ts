import { ErrorResponse } from './types';

export const isError = <T extends object>(value: T | ErrorResponse): value is ErrorResponse => {
    if (!value)
        return false;

    if ('message' in value)
        return true;

    return false;
}