import App from './App';

const app = new App().application;

app.listen(3030, () => {
  console.log('Server listening on port 3000');
});