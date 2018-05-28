# overryde

Comparing prices of uber vs. lyft rides!

The deployment demo can be found [here](https://zhehao-lu.me/overryde/).

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

## Notes on branches
This project was initiated and partly finished (very crudely indeed) during LAHacks 2018. The full history is on branch `LAHacks`. Then we did not bother to protect our server tokens so as you can see that they are lying there in the js files. But we have generated new keys and discarded the ones used in LAHacks for this deployment.
