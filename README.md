## CSCI 4300 Web Design
### Pet Website
### Arnav Guneta

#### Description
A website created for my web design class that was created using nodejs and MongoDB. Features an API for easy database access, session management, different types of user accounts with varying level of accessm and more.

#### File details
public - contains css and front end JS files  
src - contains code ran on the backend  
templates - contains the views served by the backend to the user in form of .hbs files  

#### Usage
After downloading the code from the repo, navigate to the main directory in a command prompt  

1. Ensure you have Node.js and npm installed by running `node -v` and `npm -v`. You can install them using these directions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
2. Next, you want to set up MongoDB. Follow these directions [here](https://docs.mongodb.com/manual/installation/#tutorial-installation) to get setup.
3. After installation of MongoDB, follow the same link to your respective version (Windows, macOS, Linux) installation page and find the Run section. Follow the instructions to get your database up and running.
4. Navigate to your project directory if you haven't already and type: `npm install`. This will install all package dependencies for the project.
5. After installing all package dependencies and starting the database, type: `npm run start` to run the backend server.
6. Next you'll need a way to connect to the database to perform CRUD operations. You need to do this so you can manually create an admin account later in the setup process.
7. Install [MongoDB Compass](https://www.mongodb.com/products/compass) to edit data of your database. After installing MongoDB Compass, connect to your database through Compass.
8. Using Postman, we can send requests to our custom API. To setup an admin account, you can send a POST request to `http://localhost:3000/api/users/signup`. POST request body (JSON) for an admin account needs to include: name (string), email (valid string), age (int), password (string), isAdmin (boolean).
9. After sending the request, refresh your database. A database named `pet-website-api` should've been created with a collection named `users` with 1 document.
10. Navigate to localhost:3000 in your web browser. You should now be able to log in through the admin account. Feel free to create more accounts to see how they look in the database throught Compass.
11. Create pets. You can create more pets to show up in the 'Our Pets' tab. If you navigate to the `public/img/` directory, you can use any of those images or add more yourself. Navigate to the admin console (top right, click on your name and scroll down) to create more pets. Submit the form, reload the database to see your new pet entry and navigate to the 'Our Pets' page to see the pet appear in real time.
12. There are many more features such as pet applications, user accounts, middleware auth, etc to explore so feel free to play around more.
13. Once you are authenticated, you can send API request through Postman to access restricted endpoints. You will need to copy your auth token from your browser storage and enter it to the header of the request in Postman as a Bearer token.

#### All endpoints
##### Users
POST `/api/users/signup` - create user account  
POST `/api/users/login` - login and receive auth token  
POST `/api/users/logout` - logs out current session (auth)  
POST `/api/users/logallout` - logs out all sessions (auth)  
POST `/api/users/me` - get account details (auth)  
POST `/api/users/:id` - get specified id's account details (admin auth)  
PATCH `/api/users/:id` - update specified id's account details (auth, admin auth for editing others accounts)  
DELETE `/api/users/:id` - delete specified id's account (auth, admin auth for deleting others accounts)  
##### Pet Application
POST `/api/petapps/create` - create a pet application (auth)  
POST `/api/petapps/:id` - get specified id's pet application details (auth)  
GET `/api/petapps/all` - get all pet application details (admin auth)  
PATCH `/api/petapps/:id` - update specified id's pet application details (auth, admin auth for editing others pet apps)  
DELETE `/api/petapps/:id` - delete specified id's pet application (auth, admin auth for deleting others pet apps)  
##### Pets
POST `/api/pets/create` - create a pet (admin auth)  
POST `/api/pets/:id` - get a specific pet's details (auth)  
GET `/api/pets/all` - get all pets details  
PATCH `/api/pets/:id` - update a specific pets details (admin auth)  
DELETE `/api/pets/:id` - delete specific pet (admin auth)  

Contact me (arnavguneta@gmail.com) if you need any help with setup.
