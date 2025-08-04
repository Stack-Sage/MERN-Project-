# This is full fleged Backend project includes every aspect of backend development
    - I'm using Mern Stack to build this project
    - I'm also keeping the record of every step I take in this project in readme file
    - this project is learning project but at the same time production ready

*** Lecture One *** 
--- setting up the project ---

First we have Model link 
[Model](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)


# handle the file structure 
- gitkeep, gitignore, readme, package.json, package-lock.json , public , .evv , src

-> inside src - 
  - constants.js
  - app.js
  - index.js
  - controllers
  - middlewares
  - models
  - routes
  - utils
  - db

# git init - repo is initialized [repo](https://github.com/Stack-Sage/MERN-Project-/tree/main)


## npm i -D nodemon - to install nodemon as a dev dependency
    - dev command : nodemon src/index.js

## npm i prettier - to install prettier
    - prettier is a code formatter that helps keep your code clean and consistent
    - create a .prettierrc file in the root of your project    
    - create a .prettierignore file in the root of your project


*** Lecture Two *** 
--- setting up the dataBase --- 

# MongoDB Atlas
    - create a cluster  
    - create a user
    - get the connection string
    - created a network access rule
    - created a database access rule
    - connection string generated


# Setting up .env file
   
# two approaches to connect to the database
    1. We can put write the database connection function in the index.js file
    2. We can create a separate file for the database connection and import it in the index.js file

## npm i dotenv   - to install dotenv
    - dotenv is a zero-dependency module that loads environment variables from a .env file into process.env 

## npm i mongoose - to install mongoose
    - mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js
    - it provides a schema-based solution to model your application data

## npm i express - to install express
    - express is a web application framework for Node.js, designed for building web applications and APIs


> Note: Every time we talk to data base there could be some problem we should handle that 

    - we can use try catch block to handle errors 
    - we can use async await to handle asynchronous code
    - we can use mongoose connection events to handle connection errors

# mongoose.connect() - to connect to the database
    - it takes the connection string as an argument
    - it returns a promise that resolves when the connection is successful
  
# Setting up the db_index.js file
    - create a db/index.js file in the src folder
    - create a connectDB function that connects to the database
    - export the connectDB function 
  
> note: configuring the .env file with the first file that is executed in the project is a good practice

# Setting up the index.js file
    - import the connectDB function from the db_index.js file
    - call the connectDB function to connect to the database
    - create an express app and listen on a port


### DATA BASE CONNECTION --- Sucessfull

# updating github
    - git add .
    - git commit -m "setting up the database"
    - git push origin main


*** Lecture Three ***
--- Custom Api Responses and error handling ---


# setting up express app in app.js file
    - create an express app in the app.js file
    - export the app from the app.js file
    - import the app in the index.js file
    - use the app to listen on a port


# in index.js file
    - import the express app from the app.js file
> as connectDB function will return a promise we can use .then() to handle the promise
    - call the connectDB function to connect to the database
    - use the app to listen on a port
    - handle errors using .catch() method

## npm i cors - to install cors
    - cors is a middleware that allows cross-origin requests
    - it is used to enable cross-origin resource sharing (CORS) in the application

## npm i cookie-parser - to install cookie-parser
    - cookie-parser is a middleware that parses cookies attached to the client request object
    - it is used to parse cookies in the application
    - let express read and manage cookies which is needed for login/session handling

#  setting up cors and cookie-parser in app.js file
    - import cors and cookie-parser in the app.js file
    - use cors middleware to enable CORS in the application
    - use cookie-parser middleware to parse cookies in the application
    - set the origin and credentials options for CORS

# Moving on to middle wares 
    - middleware bassically is a bridge between the request and response
    - it is a function that has access to the request object, response object, and next
    - (err, req, res, next) => {} is the signature of a middleware function
    - next is a function that is called to pass control to the next middleware function

# Creating a custom error handler middleware
    - asyncHandler is a function that takes a function as an argument and returns a new function that handles errors
    - it is used to handle errors in asynchronous code
    - we will wrap this function around our controller functions to handle errors

# created a custom ApiError class
    - it extends the built-in Error class
    - it takes a status code and a message as arguments
    - it sets the status code and message properties of the error object
    - it sets the name property to "ApiError"

# created a custom ApiResponse class
    - it takes a status code, data, and message as arguments

> Note: the ApiResponse class is used to send a consistent response format for all API responses
    1. Informational responses (100–199)
    2. Successful responses (200–299)
    3. Redirection messages (300–399)
    4. Client error responses (400–499)
    5. Server error responses (500–599)


pushing the changes to github
    - git add .
    - git commit -m "Custom Api Responses and error handling"
    - git push origin main