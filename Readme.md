# This is full fleged Backend project includes every aspect of backend development

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
