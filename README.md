# Trendit

A typescript Reddit clone that allows users to create, join, and post about their favorite subjects/topics. Connecting like-minded individuals to share and spread their knowledge to communities.

LIVE AT: https://trendit.live

[![Trendit Demo](https://i.imgur.com/XQPUyMl.gif)](https://www.youtube.com/watch?v=euXDdY7Ka5w)

Main libraries/technologies used:

NextJs, Nodejs, Express, TypeORM, PostgresSQL

- Implements user authentication and session with data hashing using bcrypt.js and JSON Web Token.
- Build a PostgreSQL database schema with bi-directional relationships using TypeORM.
- Setup server with RESTful API endpoints to route and handle client requests.
- Handle file uploading with Multer middleware to allow users to upload images to user/sub profiles.
- Implement rich text editor(CKeditor) for post submissions

Future directions:

- Implement reply feature for the comment section
- Allow user to delete and edit posts/comments
- Create and setup skeleton loading for data fetching

### License

This project is licensed under the MIT License
