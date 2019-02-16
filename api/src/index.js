const app = require('./app');

app.listen(app.get('port'));

console.log(`listening on http://localhost:${app.get('port')}`);
