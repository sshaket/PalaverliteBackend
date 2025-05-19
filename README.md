# Echo Mate Lite Backend

## Overview
Echo Mate Lite is a lightweight social media platform that allows users to create profiles, post messages, view feeds, like posts, and comment on posts. This backend is built using Express.js and connects to a MySQL database, which can be configured for local development or AWS RDS when deployed.

## Key Features
- User Authentication: Secure account creation and login.
- Profile Management: Users can create and edit profiles, including profile pictures.
- Post Management: Users can create posts, view feeds, like, and comment on posts.
- Basic Security: Encrypted connections (HTTPS) and password hashing for user authentication.
  
## Technologies Used
- Node.js v23.7.0
- Express.js
- MySQL
- TypeScript

## AWS Services for Deployment
- **Amazon RDS**: For hosting the MySQL database.
- **AWS EC2**: For hosting the Express application.
- **AWS S3**: For storing user-uploaded profile pictures (optional).
- **AWS IAM**: For managing access and permissions.

## Local Setup Instructions
1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd EchoMateLite-Backend
   ```

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Configure Environment Variables**
   - Create a `.env` file in the root directory and add the following variables:
     ```
     DB_NAME=echomatelite
     DB_USER=root
     DB_PASSWORD=Shaket@123
     DB_HOST=localhost
     DB_PORT=3307
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_email_password
     BASE_URL=http://localhost:3000
     JWT_SECRET=your_jwt_secret_key
     AWS_ACCESS_KEY_ID=your_aws_access_key_id
     AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
     AWS_REGION=your_aws_region
     AWS_BUCKET_NAME=your_bucket_name
     USE_S3=false
     ```

4. **Run SQL Scripts**
   - Execute the following SQL scripts to set up the database:
     - `sql/schema.sql`: Creates necessary tables.
     - `sql/functions.sql`: Defines SQL functions.
     - `sql/operations.sql`: Contains CRUD operations.

5. **Start the Application**
   ```
   npm run dev
   ```

## Switching Between Local Storage and AWS S3
- To switch between local storage and AWS S3 for storing profile pictures, update the `USE_S3` variable in the `.env` file:
  - For local storage: `USE_S3=false`
  - For AWS S3: `USE_S3=true`

## Configuring AWS S3
1. **Create an S3 Bucket**
   - Go to the AWS S3 console and create a new bucket.
   - Note the bucket name and region.

2. **Set Up IAM User**
   - Create an IAM user with programmatic access.
   - Attach the `AmazonS3FullAccess` policy to the user.
   - Note the access key ID and secret access key.

3. **Update Environment Variables**
   - Add the following variables to the `.env` file:
     ```
     AWS_ACCESS_KEY_ID=your_aws_access_key_id
     AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
     AWS_REGION=your_aws_region
     AWS_BUCKET_NAME=your_bucket_name
     USE_S3=true
     ```

## Testing Endpoints
- Use tools like Postman or cURL to test the API endpoints.
- Below are some example requests:

### User Registration
- **Endpoint**: POST `/api/auth/register`
- **Request Body**:
  ```json
  {
    "username": "exampleUser",
    "password": "examplePassword",
    "email": "user@example.com",
    "firstname": "FirstName",
    "lastname": "LastName",
    "photo": "path/to/photo.jpg"
  }
  ```

### User Login
- **Endpoint**: POST `/api/auth/login`
- **Request Body**:
  ```json
  {
    "username": "exampleUser",
    "password": "examplePassword"
  }
  ```

### Create Post
- **Endpoint**: POST `/api/posts`
- **Request Body**:
  ```json
  {
    "userId": 1,
    "content": "This is a post content."
  }
  ```

### Like Post
- **Endpoint**: POST `/api/posts/:postId/like`
- **Request Body**:
  ```json
  {
    "userId": 1
  }
  ```

### Get All Posts
- **Endpoint**: GET `/api/posts`
- **Request Body**: None

### Get Posts by User
- **Endpoint**: GET `/api/posts/user/:userId`
- **Request Body**: None

### Comment on Post
- **Endpoint**: POST `/api/posts/:postId/comment`
- **Request Body**:
  ```json
  {
    "userId": 1,
    "comment": "This is a comment."
  }
  ```

### Get Likes for a Post
- **Endpoint**: GET `/api/posts/:postId/likes`
- **Request Body**: None

### Get Comments for a Post
- **Endpoint**: GET `/api/posts/:postId/comments`
- **Request Body**: None

### Get User Profile
- **Endpoint**: GET `/api/users/:id`
- **Request Body**: None

### Update User Profile
- **Endpoint**: PUT `/api/users/:id`
- **Request Body**:
  ```json
  {
    "username": "newUsername",
    "email": "newEmail@example.com",
    "firstname": "NewFirstName",
    "lastname": "NewLastName",
    "profile_picture": "newProfilePic.jpg"
  }
  ```

### Delete User Profile
- **Endpoint**: DELETE `/api/users/:id`
- **Request Body**: None

## Deployment Instructions
1. **Set Up AWS RDS**
   - Create a new RDS instance with MySQL.
   - Configure security groups to allow access from your EC2 instance.

2. **Configure Database Connection**
   - Update `src/config/dbConfig.ts` with your RDS connection details.

3. **Deploy Application on EC2**
   - Launch an EC2 instance.
   - SSH into the instance and clone the repository.
   - Install Node.js and dependencies.
   - Start the application.

4. **Access the Application**
   - Use the public IP of your EC2 instance to access the API.

## Conclusion
This README provides a comprehensive guide to setting up and running the Echo Mate Lite Backend locally and deploying it on AWS. For further assistance, please refer to the documentation of the respective technologies used.
