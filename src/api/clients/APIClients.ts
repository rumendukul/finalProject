import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

interface LoginParams {
  request: APIRequestContext;
  email: string;
  password: string;
}

export class APIClients {
  async login({ request, email, password }: LoginParams): Promise<string> {
    const url = process.env.BASE_URL! + "/api-auth/login";
    //console.log('URL to print: ' + url);
    const response = await request.post(url, {
      headers: {
        Accept: "application/json",
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

  async getRequest(
    { request }: { request: APIRequestContext },
    endpoint: string,
    token: string,
  ): Promise<APIResponse> {
    const url = process.env.BASE_URL! + endpoint;

    const response = await request.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  }

  async postRequest(
    { request }: { request: APIRequestContext },
    endpoint: string,
    token: string,
    data: object,
  ): Promise<APIResponse> {
    const url = process.env.BASE_URL! + endpoint;

    const response = await request.post(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data,
    });

    return response;
  }

  async putRequest(
    { request }: { request: APIRequestContext },
    endpoint: string,
    token: string,
    data: object,
  ): Promise<APIResponse> {
    const url = process.env.BASE_URL! + endpoint;

    const response = await request.put(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data,
    });

    return response;
  }
}

export function createPatientBody() {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    dob: faker.date
      .birthdate({ min: 18, max: 110, mode: "age" })
      .toISOString()
      .split("T")[0],
    gender: faker.helpers.arrayElement(["Male", "Female"]),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    emergency_contact_name: faker.person.fullName(),
    emergency_contact_phone: faker.phone.number(),
    insurance_provider: faker.company.name(),
    insurance_policy_number: faker.string.alphanumeric(10).toUpperCase(),
  };
}

export async function getRandomPatientId(
  endpoint: string,
  request: APIRequestContext,
  token: string,
): Promise<string> {
  const url = process.env.BASE_URL! + endpoint;
  const response = await request.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = await response.json();
  const patients = responseBody.data;
  const patientIds = patients.map((patient) => patient.patient_id);
  const randomPatientId =
    patientIds[Math.floor(Math.random() * patientIds.length)];
  console.log(randomPatientId);
  return randomPatientId;
}

export async function getRandomProviderId(
  endpoint: string,
  request: APIRequestContext,
  token: string,
): Promise<string> {
  const url = process.env.BASE_URL! + endpoint;
  const response = await request.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = await response.json();
  const providers = responseBody.data;
  const providerIds = providers.map((provider) => provider.user_id_friendly);
  const randomProviderId =
    providerIds[Math.floor(Math.random() * providerIds.length)];
  console.log(randomProviderId);
  return randomProviderId;
}

export async function getRandomAppointmentId(
  endpoint: string,
  request: APIRequestContext,
  token: string,
): Promise<string> {
  const url = process.env.BASE_URL! + endpoint;
  const response = await request.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = await response.json();
  const appointments = responseBody.data;
  const appointmentIds = appointments.map(
    (appointment) => appointment.appointment_id,
  );
  const randomAppointmentId =
    appointmentIds[Math.floor(Math.random() * appointmentIds.length)];
  console.log(randomAppointmentId);
  return randomAppointmentId;
}

export async function createAppointmentBody(
  request: APIRequestContext,
  token: string,
) {
  const patientId = await getRandomPatientId(
    "/api-patients",
    request,
    token,
  );
  const providerId = await getRandomProviderId(
    "/api-providers",
    request,
    token,
  );
  const startDate = faker.date.future();
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  return {
    patient_id: patientId,
    provider_id: providerId,
    datetime_start: startDate.toISOString(),
    datetime_end: endDate.toISOString(),
    reason: "allergy",
  };
}
