import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

interface LoginParams {
    request: APIRequestContext;
    email: string;
    password: string;
}

export class APIClients {
    async login({ request, email, password }: LoginParams): Promise<string> {
        const url = process.env.BASE_URL! + '/api-auth/login';
        console.log('URL to print: ' + url);
        const response = await request.post(url, {
            headers: {
                Accept: 'application/json',
            },
            data: {
                email,
                password,
            },
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.token).toBeTruthy();
        return body.token;
    }

    async getRequest({ request }: { request: APIRequestContext }, endpoint: string, token: string): Promise<APIResponse> {
        const url = process.env.BASE_URL! + endpoint;

        const response = await request.get(url, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });

        return response;
    }

    async postRequest({ request }: { request: APIRequestContext }, endpoint: string, token: string, data: object): Promise<APIResponse> {
        const url = process.env.BASE_URL! + endpoint;

        const response = await request.post(url, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data,
        });

        return response;
    }
}

export function createPatientBody() {
    return {
        "first_name": faker.person.firstName(),
        "last_name": faker.person.lastName(),
        "dob": faker.date.birthdate({ min: 18, max: 110, mode: 'age' }).toISOString().split('T')[0],
        "gender": faker.helpers.arrayElement(['Male', 'Female']),
        "phone": faker.phone.number(),
        "email": faker.internet.email(),
        "address": faker.location.streetAddress(),
        "emergency_contact_name": faker.person.fullName(),
        "emergency_contact_phone": faker.phone.number(),
        "insurance_provider": faker.company.name(),
        "insurance_policy_number": faker.string.alphanumeric(10).toUpperCase()
    };
}
            
