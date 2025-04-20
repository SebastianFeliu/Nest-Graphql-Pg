import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return an empty list of users initially', async () => {
    const query = `{
      users {
        id
        name
        age
      }
    }`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.users)).toBe(true);
  });

  it('should create a new user via mutation', async () => {
    const mutation = `
      mutation {
        createUser(input: { name: "Alice", age: 28 }) {
          id
          name
          age
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation });

    expect(response.status).toBe(200);
    expect(response.body.data.createUser.name).toBe('Alice');
    expect(response.body.data.createUser.age).toBe(28);
    expect(response.body.data.createUser.id).toBeDefined();
  });

  it('should update a user via mutation', async () => {
    const createMutation = `
      mutation {
        createUser(input: { name: "ToUpdate", age: 33 }) {
          id
          name
          age
        }
      }
    `;

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createMutation });

    const createdUser = createResponse.body.data.createUser;

    const updateMutation = `
      mutation {
        updateUser(id: "${createdUser.id}", input: { name: "UpdatedName" }) {
          id
          name
          age
        }
      }
    `;

    const updateResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: updateMutation });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.updateUser.name).toBe('UpdatedName');
    expect(updateResponse.body.data.updateUser.id).toBe(createdUser.id);
  });

  it('should delete a user via mutation', async () => {
    const createMutation = `
      mutation {
        createUser(input: { name: "ToDelete", age: 40 }) {
          id
          name
          age
        }
      }
    `;

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createMutation });

    const userToDelete = createResponse.body.data.createUser;

    const deleteMutation = `
      mutation {
        deleteUser(id: "${userToDelete.id}")
      }
    `;

    const deleteResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: deleteMutation });

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data.deleteUser).toBe(true);
  });

  it('should return the newly created user in users query', async () => {
    const query = `{
      users {
        name
        age
      }
    }`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(response.status).toBe(200);
    expect(response.body.data.users.length).toBeGreaterThan(0);
    expect(response.body.data.users[0]).toHaveProperty('name');
    expect(response.body.data.users[0]).toHaveProperty('age');
    expect(response.body.data.users[0]).not.toHaveProperty('id');
  });
});
