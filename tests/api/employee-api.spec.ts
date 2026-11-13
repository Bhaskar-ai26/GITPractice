import { test, expect, APIRequestContext } from '@playwright/test';

// Tests share one server-side member store, so they run serially to avoid create/delete races.
test.describe.configure({ mode: 'serial' });

const BASE_URL = 'http://localhost:5002';
const BASIC_AUTH = 'Basic YWRtaW46YWRtaW4=';
const auth = { Authorization: BASIC_AUTH };

interface Member {
  id: number;
  name: string;
  gender: string;
}

interface ErrorResponse {
  msg?: string;
  error?: string;
  message?: string;
}

interface TokenResponse {
  token_type: string;
  access_token: string;
  expires_in: string | number;
}

interface UpdateResponse {
  msg: string;
  member: Member;
}

interface DeleteResponse {
  msg: string;
  members: Member[];
}

interface FileUploadResponse {
  success: boolean;
  message: string;
  url?: string;
}

async function createMember(request: APIRequestContext, data: { name: string; gender: string }): Promise<Member> {
  const response = await request.post(`${BASE_URL}/api/members`, { headers: auth, data });
  expect(response.status()).toBe(201);
  return response.json();
}

async function deleteMember(request: APIRequestContext, id: number): Promise<void> {
  await request.delete(`${BASE_URL}/api/members/${id}`, { headers: auth });
}

test.describe('Auth endpoints', () => {
  test('POST /api/auth/login issues a bearer token for valid credentials', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { username: 'admin', password: 'admin' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json() as TokenResponse;
    expect(body.token_type).toBe('Bearer');
    expect(typeof body.access_token).toBe('string');
    expect(body.access_token.length).toBeGreaterThan(0);
    expect(body.expires_in).toBe('1h');
  });

  test('POST /api/auth/login rejects invalid credentials with 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { username: 'admin', password: 'wrong-password' },
    });
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({
      error: 'invalid_credentials',
      message: 'Invalid username or password',
    });
  });

  test('POST /api/auth/login rejects a request with no credentials with 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, { data: {} });
    expect(response.status()).toBe(401);
  });

  test('POST /oauth/token issues an access token for client_credentials', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/oauth/token`, {
      data: {
        grant_type: 'client_credentials',
        client_id: 'demo-client',
        client_secret: 'demo-secret',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json() as TokenResponse;
    expect(body.token_type).toBe('Bearer');
    expect(typeof body.access_token).toBe('string');
    expect(body.expires_in).toBe(3600);
  });

  test('POST /oauth/token rejects an unsupported grant type with 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/oauth/token`, {
      data: {
        grant_type: 'password',
        client_id: 'demo-client',
        client_secret: 'demo-secret',
      },
    });
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: 'unsupported_grant_type' });
  });

  test('POST /oauth/token rejects invalid client credentials with 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/oauth/token`, {
      data: {
        grant_type: 'client_credentials',
        client_id: 'demo-client',
        client_secret: 'wrong-secret',
      },
    });
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: 'invalid_client' });
  });
});

test.describe('Authorization on member endpoints', () => {
  test('member endpoints return 401 without credentials', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members`);
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: 'unauthorized' });
  });

  test('member endpoints accept Basic authentication', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members`, { headers: auth });
    expect(response.status()).toBe(200);
  });

  test('member endpoints reject a JWT from /api/auth/login as bearer token (current behavior)', async ({ request }) => {
    const login = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { username: 'admin', password: 'admin' },
    });
    const { access_token } = await login.json() as TokenResponse;
    const response = await request.get(`${BASE_URL}/api/members`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    expect(response.status()).toBe(401);
  });
});

test.describe('GET /api/members', () => {
  test('returns the full list of members as an array', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members`, { headers: auth });
    expect(response.status()).toBe(200);
    const members = await response.json() as Member[];
    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBeGreaterThan(0);
    for (const member of members) {
      expect(typeof member.id).toBe('number');
      expect(typeof member.name).toBe('string');
      expect(typeof member.gender).toBe('string');
    }
  });

  test('filters by gender=female (case-insensitive match)', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members?gender=female`, { headers: auth });
    expect(response.status()).toBe(200);
    const members = await response.json() as Member[];
    expect(members.length).toBeGreaterThan(0);
    for (const member of members) {
      expect(member.gender.toLowerCase()).toBe('female');
    }
  });

  test('returns 404 when no member matches the gender filter', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members?gender=other`, { headers: auth });
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ msg: "Member with gender other doesn't exist" });
  });
});

test.describe('GET /api/members/{id}', () => {
  test('returns the member for an existing id', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members/1`, { headers: auth });
    expect(response.status()).toBe(200);
    const members = await response.json() as Member[];
    expect(members).toEqual([{ id: 1, name: 'John Smith', gender: 'Male' }]);
  });

  test('returns 404 for an id that does not exist', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members/999`, { headers: auth });
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ msg: "Member with id 999 doesn't exist" });
  });

  test('returns 404 for a non-numeric id', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members/abc`, { headers: auth });
    expect(response.status()).toBe(404);
  });
});

test.describe('POST /api/members', () => {
  test('creates a member and returns 201 with the new record', async ({ request }) => {
    const member = await createMember(request, { name: 'Playwright Create', gender: 'female' });
    try {
      expect(member).toEqual({ id: expect.any(Number), name: 'Playwright Create', gender: 'female' });
    } finally {
      await deleteMember(request, member.id);
    }
  });

  test('accepts names at the 4 and 25 character boundaries', async ({ request }) => {
    for (const name of ['abcd', 'a'.repeat(25)]) {
      const member = await createMember(request, { name, gender: 'male' });
      await deleteMember(request, member.id);
    }
  });

  test('rejects a name shorter than 4 characters with 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/members`, {
      headers: auth,
      data: { name: 'abc', gender: 'male' },
    });
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ msg: 'Name should be 4 to 25 characters long' });
  });

  test('rejects a name longer than 25 characters with 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/members`, {
      headers: auth,
      data: { name: 'a'.repeat(26), gender: 'male' },
    });
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ msg: 'Name should be 4 to 25 characters long' });
  });

  test('rejects an invalid gender with 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/members`, {
      headers: auth,
      data: { name: 'Valid Name', gender: 'other' },
    });
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ msg: 'Gender should be either male or female only' });
  });

  test('rejects a request missing gender with 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/members`, {
      headers: auth,
      data: { name: 'Valid Name' },
    });
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ msg: 'Please provide a name and gender' });
  });
});

test.describe('PUT /api/members/{id}', () => {
  test('updates only the name when only name is provided', async ({ request }) => {
    const created = await createMember(request, { name: 'Put Original', gender: 'male' });
    try {
      const response = await request.put(`${BASE_URL}/api/members/${created.id}`, {
        headers: auth,
        data: { name: 'Put Renamed' },
      });
      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual({
        msg: `Member with id ${created.id} is updated successfully`,
        member: { id: created.id, name: 'Put Renamed', gender: 'male' },
      });
    } finally {
      await deleteMember(request, created.id);
    }
  });

  test('updates only the gender when only gender is provided', async ({ request }) => {
    const created = await createMember(request, { name: 'Put Gender', gender: 'male' });
    try {
      const response = await request.put(`${BASE_URL}/api/members/${created.id}`, {
        headers: auth,
        data: { gender: 'female' },
      });
      expect(response.status()).toBe(200);
      const body = await response.json() as UpdateResponse;
      expect(body.member).toEqual({ id: created.id, name: 'Put Gender', gender: 'female' });
    } finally {
      await deleteMember(request, created.id);
    }
  });

  test('an empty body returns 200 and leaves the member unchanged', async ({ request }) => {
    const created = await createMember(request, { name: 'Put Empty', gender: 'male' });
    try {
      const response = await request.put(`${BASE_URL}/api/members/${created.id}`, {
        headers: auth,
        data: {},
      });
      expect(response.status()).toBe(200);
      const body = await response.json() as UpdateResponse;
      expect(body.member).toEqual({ id: created.id, name: 'Put Empty', gender: 'male' });
    } finally {
      await deleteMember(request, created.id);
    }
  });

  test('rejects an invalid name length with 400', async ({ request }) => {
    const created = await createMember(request, { name: 'Put Invalid', gender: 'male' });
    try {
      const response = await request.put(`${BASE_URL}/api/members/${created.id}`, {
        headers: auth,
        data: { name: 'ab' },
      });
      expect(response.status()).toBe(400);
      expect(await response.json()).toEqual({ msg: 'Name should be 4 to 25 characters long' });
    } finally {
      await deleteMember(request, created.id);
    }
  });

  test('rejects an invalid gender with 400', async ({ request }) => {
    const created = await createMember(request, { name: 'Put Bad Gender', gender: 'male' });
    try {
      const response = await request.put(`${BASE_URL}/api/members/${created.id}`, {
        headers: auth,
        data: { gender: 'x' },
      });
      expect(response.status()).toBe(400);
      expect(await response.json()).toEqual({ msg: 'Gender should be either male or female only' });
    } finally {
      await deleteMember(request, created.id);
    }
  });

  test('returns 404 for an id that does not exist', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/api/members/999`, {
      headers: auth,
      data: { name: 'Nobody Here' },
    });
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ msg: "Member with id 999 doesn't exist" });
  });
});

test.describe('DELETE /api/members/{id}', () => {
  test('deletes an existing member and returns the remaining members', async ({ request }) => {
    const created = await createMember(request, { name: 'Delete Me', gender: 'male' });
    const response = await request.delete(`${BASE_URL}/api/members/${created.id}`, { headers: auth });
    expect(response.status()).toBe(200);
    const body = await response.json() as DeleteResponse;
    expect(body.msg).toBe(`Member with id ${created.id} is deleted successfully`);
    expect(Array.isArray(body.members)).toBe(true);
    expect(body.members.some((m) => m.id === created.id)).toBe(false);

    const lookup = await request.get(`${BASE_URL}/api/members/${created.id}`, { headers: auth });
    expect(lookup.status()).toBe(404);
  });

  test('returns 404 for an id that does not exist', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/api/members/999`, { headers: auth });
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ msg: "Member with id 999 doesn't exist" });
  });
});

test.describe('POST /api/upload', () => {
  const PNG_1X1 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64',
  );

  test('uploads an image file and returns 201 with a URL', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/upload`, {
      headers: auth,
      multipart: {
        file: { name: 'playwright-probe.png', mimeType: 'image/png', buffer: PNG_1X1 },
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json() as FileUploadResponse;
    expect(body.success).toBe(true);
    expect(body.message).toBe('File uploaded successfully!');
    expect(body.url).toMatch(/^http:\/\/localhost:5002\/fileuploads\/.+\.png$/);
  });

  test('rejects an unsupported file extension with 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/upload`, {
      headers: auth,
      multipart: {
        file: { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') },
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json() as FileUploadResponse;
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unsupported extension!');
  });

  test('returns 401 without credentials', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/upload`, {
      multipart: {
        file: { name: 'playwright-probe.png', mimeType: 'image/png', buffer: PNG_1X1 },
      },
    });
    expect(response.status()).toBe(401);
  });

  test('request with no file part returns 500 (spec documents 400) (current behavior)', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/upload`, {
      headers: auth,
      multipart: { note: 'no file attached' },
    });
    expect(response.status()).toBe(500);
  });
});
