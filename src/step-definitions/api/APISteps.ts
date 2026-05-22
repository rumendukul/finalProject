import { Given, When, Then, Before } from "@cucumber/cucumber";
import {
  APIClients,
  getRandomAppointmentId,
  getRandomPatientId,
} from "../../api/clients/APIClients";
import { request, expect } from "@playwright/test";
import {
  createPatientBody,
  createAppointmentBody,
} from "../../api/clients/APIClients";

const apiClient = new APIClients();

Before(async function () {
  this.request = await request.newContext();
});

Given("doctor is logged in", async function () {
  const apiClient = new APIClients();

  this.token = await apiClient.login({
    request: this.request,
    email: process.env.USER_EMAIL,
    password: process.env.USER_PASSWORD,
  });
});

When("user hits GET {string}", async function (endpoint) {
  this.response = await apiClient.getRequest(
    { request: this.request },
    endpoint,
    this.token,
  );
  console.log(await this.response.json());
});

Then("verify status code is {int}", function (expectedStatusCode) {
  expect(this.response.status()).toBe(expectedStatusCode);
});

When("user hits POST {string} with body", async function (endpoint) {
  let requestBody;

  if (endpoint === "/api-patients") {
    requestBody = createPatientBody();
  } else if (endpoint === "/api-appointments") {
    requestBody = await createAppointmentBody(this.request, this.token);
  } else {
    throw new Error(`Unsupported endpoint: ${endpoint}`);
  }

  console.log(requestBody);
  this.response = await apiClient.postRequest(
    { request: this.request },
    endpoint,
    this.token,
    requestBody,
  );
});

When("user provides {string} with {string}", async function (key, value) {
  this.requestBody = {
    ...this.requestBody,
    [key]: value,
  };
});

When("user hits PUT {string}", async function (endpoint) {
  let randomId;
  let requestBody;

  if (endpoint === "/api-patients") {
    randomId = await getRandomPatientId(endpoint, this.request, this.token);

    requestBody = {
      ...createPatientBody(),
      ...this.requestBody,
    };
  } else if (endpoint === "/api-appointments") {
    randomId = await getRandomAppointmentId(endpoint, this.request, this.token);

    requestBody = {
      ...(await createAppointmentBody(this.request, this.token)),
      ...this.requestBody,
    };
  } else {
    throw new Error(`Unsupported endpoint: ${endpoint}`);
  }

  const putEndpointWithId = `${endpoint}/${randomId}`;

  this.response = await apiClient.putRequest(
    { request: this.request },
    putEndpointWithId,
    this.token,
    requestBody,
  );

  console.log(await this.response.json());
});

Then(
  "verify response body contains {string} with {string}",
  async function (key, value) {
    const responseBody = await this.response.json();
    const responseData = responseBody.data ?? responseBody;

    expect(responseData[key]).toBe(value);
  },
);

When("user hits POST {string}", async function (endpoint) {
  let finalEndpoint = endpoint;

  if (endpoint.includes("{appointmentId}")) {
    const appointmentId = await getRandomAppointmentId(
      "/api-appointments",
      this.request,
      this.token,
    );

    finalEndpoint = endpoint.replace("{appointmentId}", appointmentId);
  }

  this.response = await apiClient.postRequest(
    { request: this.request },
    finalEndpoint,
    this.token,
    this.requestBody ?? {},
  );

  console.log(await this.response.json());
});
