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
The version deployed is on branch `dev`. I used nginx to proxy_pass the requests to the designated port on my server, but the `GET` requests made by the html file (when including javascript from public/) are made to my homepage so I have to manually add the prefix `/overryde/`. I'm going to look deeper into how nginx works and figure out a solution.