# Blogging-App
A complete Blogging app using Modern Web Technologies i.e Reactjs, Redux, ReduxSaga, React Hooks, React Context, MongoDB, NodeJS, ExpressJS, webSocket, Webpack, REST, GraphQL, JWT

------------------------------------------------------------------------------------------------------------------------------
                                                       Phase 1
------------------------------------------------------------------------------------------------------------------------------

-----------
CLIENT
-----------
Blog App created using ReactJS.
Major Components are related to signup, login , SinglePost, Feeds , EditPost, Error handling.

Current status : Plain reactJS app with no support for storage management, Error Boundaries, Division of functional and UI components, Interceptors, axios, Middleware for side effects

=====
PLAN for phase1
=====
1. Code Refactor for separation of UI components and functional Components
2. Create Reusable Functional components with Hooks
3. Use Redux for store Management
4. Use Redux-Saga for handling side Effects
5. Use axios library for ajax requests

Note: interceptor implementation for network request (might be moved to phase2)


-----------
SERVER
-----------
Blog App BackEND created using NodeJS, ExpressJS and MongoDB.
MVC Architecture followed.

Major Controllers are auth and feed.
Database handling using Mongoose and MongoDB Atlas Cloud.
Field Validation done using express-validator module.
File Upload done using express-multer.
login Authentication done using JWT Authentication process.
MiddleWare added for error handling.
API Integration using REST.


Current status : NodeJS BackEnd with tightly integrated expressJS framework and NoSQL database i.e MongoDB with API integration using REST.

=====
PLAN for phase1
=====
1. Code Refactor for handling asynchronous operations by replacing Promises with async/await.(whereEver possible)
2. SocketIo integration for Real Time Post Addition.
3. Replace REST with GraphQL.
