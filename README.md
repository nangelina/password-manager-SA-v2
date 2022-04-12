# Password Manager

This is a simple locally hosted HTTPS client/server password manager where you can log in to your account with a master password in order to access an encrypted vault of all your website logins.

The client side does most of the encryption, only sending the required encrypted cipher strings to the backend so that they can be stored in a locally hosted mongo database. The backend server is responsible for routing to the mongodb database, and for authenticating the user with a passport LocalStrategy. The only extra encryption the server does is doing an additional salted hash on top of the already hashed (on the client side) master password.

## Project Structure

- `client`
  - `src/certs`: This folder contains HTTPS certificates for the client application.
  - `src/crypto`: This folder contains helper functions for all the encryption methods used in the client application.
  - `src/password`: This folder contains helper functions for password strength checking and generation.
  - `src/pages`: This folder contains pages that App.jsx uses for routing.
  - `src/components`: This folder contains sub-components used in the page components.
  - `src/services/userContext.js` contains a Provider / Context so that some variables can be accessed across all components.
- `server`
  - `certs`: This folder contains HTTPS certificates for the server.
  - `middleware`: This folder contains middleware for setting up the internals of the server, like connecting to mongoose. It also has a middleware function that ensures someone can't access a route unless they are logged in.
  - `models`: This folder contains the main User mongoose model which stores the user's encrypted keys.
  - `routes/apiRoutes.js`: This contains routes used by the client:
    - `/api/auth` is where we go to read, create, or delete our current login session.
      - The create portion (`POST /api/auth`) uses the `passport.authenticate` middleware, which will read the user's credentials they posted and either log them in or return a 401 error.
      - `GET /api/auth` simply returns the currently logged in user's info, if they are logged in.
      - `DELETE /api/auth` will effectively log the user out.
    - `/api/users` has a POST route for creating a new user.
    - `/api/vault` returns the user's encrypted vault if the user is logged in. If the user is not logged in, it will return a 403 Forbidden error.
  - `server.js` is a typical express server that first configures Passport and then configures the routes (which have dependencies on passport).
  - `passport.js` has the passport configuration. The order the various pieces are configured are important. Other than that, there are descriptive comments about what each section is doing. Sessions are used to keep a user logged in once they have logged in.

## Running the Example

1. In a separate terminal window, start mongodb
2. Navigate to the backend server folder (`cd server`)
3. Edit the .env file in server with your mongodb url
4. Create HTTPS certificates for localhost and put them in a folder `certs` (alternatively, you can edit server's .env file to change the path of the certificates)
5. Run `npm install`
6. Once that is done, run `npm start` to start the server
7. `cd ../client`
8. Create localhost HTTPS certificates for the frontend as well and place them in `src/certs`, or alternatively edit the client's .env file to change the paths
9. Run `npm install`
10. Run `npm start`

## Thank You To:

- [This repo contains various PassportJS examples for a variety of configurations, which helped me use passport in my server as authentication middleware](https://github.com/moribvndvs/passport-examples)
- [My client-side encryption methods were inspired by Bitwarden's](https://bitwarden.com/images/resources/security-white-paper-download.pdf/)
