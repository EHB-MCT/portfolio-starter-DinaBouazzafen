const app = require('./app');

const port = 3000;

app.listen(port, () => {
  console.log(`This server is running on port ${port}`);
});
