import React, { Fragment } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Loading, Header, LaunchDetail } from '../components';
import { ActionButton } from '../containers';

import { LAUNCH_TILE_DATA } from './launches';

export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      isInCart @client
      site
      rocket {
        type
      }
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`;

export const GET_ARR = gql`
  query Array {
    arr @client
  }
`;

const UPDATE_ARR = gql`
  mutation update($num: Int) {
    updateTestArray(num: $num) @client {
      success @client
    }
  }
`;

const Launch = ({ launchId }) => {
  const { data, loading, error } = useQuery(GET_LAUNCH_DETAILS, {
    variables: { launchId },
  });

  const [getArr, { data: testData }] = useLazyQuery(GET_ARR);


  const [updateArr, { data: updatedArr }] = useMutation(UPDATE_ARR);
  console.log('updatedArr', updatedArr);

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;
  if (!data) return <p>Not found</p>;

  const callTest = () => {
    updateArr({
      variables: {
        num: 23,
      },
    });
  };

  return (
    <Fragment>
      <Header
        image={
          data.launch && data.launch.mission && data.launch.mission.missionPatch
        }
      >
        {data && data.launch && data.launch.mission && data.launch.mission.name}
      </Header>
      <LaunchDetail {...data.launch} />
      <ActionButton {...data.launch} />
      <button onClick={getArr}>query BUTTON</button>
      <button onClick={callTest}>mutation BUTTON</button>
    </Fragment>
  );
};

export default Launch;
