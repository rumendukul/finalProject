import { Given, When, Then, Before } from '@cucumber/cucumber';
import { APIClients } from '../../api/clients/APIClients';
import { request, expect } from '@playwright/test';

const apiClient = new APIClients();

Before(async function () {
    this.request = await request.newContext();
});

Given('doctor is logged in', async function () {
    const apiClient = new APIClients();

    this.token = await apiClient.login({
        request: this.request,
        email: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD
    });
});

When('user hits GET {string}', async function (endpoint) {
        this.response = await apiClient.getRequest({request : this.request}, endpoint, this.token);
        console.log(await this.response.json());
});

Then('verify status code is {int}', function (expectedStatusCode) {
    expect(this.response.status()).toBe(expectedStatusCode);
});

When('user hits POST {string} with body', async function (endpoint, docString) {
    this.response = await apiClient.postRequest(
        { request: this.request },
        endpoint,
        this.token,
        JSON.parse(docString),
    );
});
       
