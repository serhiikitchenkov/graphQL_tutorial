import gql from 'graphql-tag';
import { GET_CART_ITEMS } from './pages/cart';
import { GET_ARR } from './pages/launch';

export const schema = gql`
  extend type Launch {
    isInCart: Boolean!
  }
`;

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  type updatedArrayType {
    arr: [Int]
    success: Boolean
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
    updateTestArray(num: Int): lala

  }

  type MyTestType {
    arr: [Int]
    isEdited: Boolean
  }
`;

export const resolvers = {
  Launch: {
    isInCart: (launch, _, { cache }) => {
      const queryResult = cache.readQuery({
        query: GET_CART_ITEMS,
      });

      if (queryResult) {
        return queryResult.cartItems.includes(launch.id);
      }
      return false;
    },
  },

  Mutation: {
    updateTestArray: (_, { num }, { cache }) => {
      const { arr } = cache.readQuery({
        query: GET_ARR,
      });
      arr.push(num);
      return {
        __typename: "updatedArrayType",
        arr,
        success: true
      }
    },
    addOrRemoveFromCart: (_, { id }, { cache }) => {
      const queryResult = cache.readQuery({
        query: GET_CART_ITEMS,
      });

      if (queryResult) {
        const { cartItems } = queryResult;
        const data = {
          cartItems: cartItems.includes(id)
            ? cartItems.filter((i) => i !== id)
            : [...cartItems, id],
        };

        cache.writeQuery({ query: GET_CART_ITEMS, data });
        return data.cartItems;
      }
      return [];
    },
  },
};
