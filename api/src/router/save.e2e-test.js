const request = require('supertest');
const app = require('../../src/app');

describe(`GET /save`, () => {
  it(`returns 400 if missing "url" query param`, (done) => {
    return request(app)
      .get('/save')
      .expect(400)
      .expect(response => {
        expect(response.body.message).toBe('Missing required query params "url"');
      })
      .end(done)
    ;
  });

  it(`redirects with 301 to blindtest URL when available`, (done) => {
    jest.setTimeout(30000);

    return request(app)
      .get('/save?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      .expect(301)
      .expect(response => {
        expect(response.headers.location).toMatch('http://localhost:3030/stream/');
      })
      .end(done)
    ;
  });
});
