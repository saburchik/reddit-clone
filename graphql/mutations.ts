import { gql } from '@apollo/client'

export const ADD_POST = gql`
  mutation MyMutation(
    $body: String!
    $title: String!
    $image: String!
    $username: String!
    $subreddit_id: ID!
  ) {
    insertPost(
      body: $body
      title: $title
      image: $image
      username: $username
      subreddit_id: $subreddit_id
    ) {
      body
      title
      image
      username
      subreddit_id
    }
  }
`
