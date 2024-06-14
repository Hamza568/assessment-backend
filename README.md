Step 0: Create a monggodb database named `assessment` with a collection named `users`

Step 1: Create the .env File

Create a new file named .env in the root directory of your project and add the following content:

        PORT=5000
        MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority

Replace the <username>, <password>, and <database> with your actual MongoDB Atlas credentials and database name.

Alternatively if you're using a local database then your .env file should look something like this
        
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/assessment        

Step 2: Install Dependencies

Install the necessary node modules:

        npm install

Step 3: Run the Backend Server

You can now run your backend server and it should be able to access the users data in your MongoDB database.

        npm start

Make sure to add the .env file to your .gitignore file to prevent it from being committed to version control.

        # .gitignore
        node_modules/
        .env
