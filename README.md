To run this project, install dependancies and use command: node server.js

Note: A redis store must be initialized beforehand on your local machine to run this project

The users are stored in the form of a Hashed set, with the userId being the key to access the stored object with the user and a taskKey present in the user object that points to the list of the tasks, kind of as a pseudo foreign-key

The tasks are stored in the form of key-list pairs

The user 

There are 4 api calls:

1) Creating a user by supplying firstName and lastName
2) Getting a created user's details by supplying userId
3) Creating a todo item for a user by supplying userId and the item value
4) Getting all todo items for a user by supplying the userId

Attached with the email should be the screenshots for the api calls in postman, for easier understanding of the api formats
