/*
 * Copyright 2018 American Express
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { getStateOfQuery } from '../duck/selectors';
import executeFetch from '../executeFetch';
import { validatePointersToQueryData } from './validatePointersToData';

const actionType = 'QUERY';
const fnName = 'queryGraphQLData';

export default function queryGraphQLData({
  endpointName,
  query,
  variables = null,
  forceFetch = false,
  opts = {},
}) {
  console.log(`$$$inside queryGraphQLData fetch opts ${JSON.stringify(opts)}`);
  validatePointersToQueryData({
    fnName, endpointName, query, variables,
  });

  return (dispatch, getState) => {
    if (!forceFetch) {
      const queryState = getStateOfQuery({ endpointName, query, variables })(getState);
      if (queryState) {
        return queryState.toJS();
      }
    }

    const promise = dispatch(executeFetch({
      actionType,
      endpointName,
      query,
      variables,
      opts,
    }));

    return {
      promise,
      status: 'loading',
    };
  };
}
