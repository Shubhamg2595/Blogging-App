const { buildSchema } = require('graphql');


module.exports = buildSchema(`

    type AuthData {
        userId: ID!
        token: String!
    }

    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String
    }

    input PostInput {
        title: String!
        content: String!
        imageUrl: String!
    }

    type User{
        _id: ID! 
        name: String!
        email: String!
        password: String! 
        status: String!
        posts: [Post!]!

    }

    input UserInput {
        email: String!
        name: String!
        password: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }


    type RootQuery {
        login(loginInput: LoginInput!) : AuthData!
    }

    type RootMutation {
        createUser(userInput: UserInput) : User!
        createPost(postInput: PostInput): Post!
    }

   

    schema {
        query: RootQuery
        mutation: RootMutation
    }
 

`);