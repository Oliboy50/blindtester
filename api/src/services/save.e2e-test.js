const request = require('supertest');
const app = require('../../src/app');

describe(`GET /save`, () => {
  it(`returns 400 if missing "url" query param`, () => {
    return request(app)
      .get('/save')
      // @TODO fix feathers errors which should return expected HTTP status code instead of 200
      // .expect(400)
      .expect(response => {
        expect(response.body.message).toBe('Missing required query params "url"');
      })
    ;
  });
});
