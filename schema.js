export const typeDefs = `#graphql
    type Post {
        userId: ID!
        id: ID!
        title: String!
        body: String!
    }

    type Comment {
        postId: ID!
        id: ID!
        name: String!
        email: String!
        body: String!
    }

    type Query {
        comments: [Comment]
        posts: [Post]
    }
`
