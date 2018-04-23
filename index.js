import SpotifyWebApi from 'spotify-web-api-node';
import opn from 'opn';
import express from 'express';

const scopes = ['user-modify-playback-state'];
const credentials = {
  clientId: '',
  clientSecret: '',
  redirectUri: '',
};

const spotifyApi = new SpotifyWebApi(credentials);
const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
opn(authorizeURL);

const app = express();

app.get('/spotify-code', (req, res) => {
  console.log(req.query.code);
  spotifyApi.authorizationCodeGrant(req.query.code)
    .then((data) => {
      console.log(`The token expires in ${data.body.expires_in}`);
      console.log(`The access token is ${data.body.access_token}`);
      console.log(`The refresh token is ${data.body.refresh_token}`);

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body.access_token);
      spotifyApi.setRefreshToken(data.body.refresh_token);
    }, (err) => {
      console.log('Something went wrong!', err);
    });
  res.send('Hello World!');
});

app.get('/next', (req, res) => {
  spotifyApi.skipToNext
    .then((res) => {
      console.log(res);
    });
  res.send('Hello World!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
