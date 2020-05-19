const { buildSchema } = require('graphql');


module.exports = buildSchema(`

   

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

    type AuthData {
        userId: ID!
        token: String!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }


    type RootQuery {
        login(loginInput: LoginInput!) : AuthData!
        posts(page: Int!): PostData!
        post(id: ID!): Post!
    }

    type RootMutation {
        createUser(userInput: UserInput) : User!
        createPost(postInput: PostInput): Post!
        updatePost(id: ID! , postInput: PostInput) : Post!
    }

   

    schema {
        query: RootQuery
        mutation: RootMutation
    }
 

`);