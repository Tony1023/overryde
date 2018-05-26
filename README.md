# overryde

Comparing prices of uber vs. lyft rides!

## Instructions
1. git clone this repo and `npm install` or `yarn install`
2. create a .js file in this format:
```javascript
module.exports = {
  lyftKey: '<your converted key here>',
  uberKey: '<your uber server token here>'
}
```
You should convert the lyft client id and client secret [here](https://kigiri.github.io/fetch/). Type in `curl --user "<client_id>:<client_secret>"` and copy the string after "Basic ".

3. `npm start` or `yarn start` to start the project and go to `http://localhost:3000/`