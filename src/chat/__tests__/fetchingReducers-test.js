import deepFreeze from 'deep-freeze';

import fetchingReducers from '../fetchingReducers';
import { homeNarrowStr, streamNarrow } from '../../utils/narrow';
import { SWITCH_NARROW, MESSAGE_FETCH_START, MESSAGE_FETCH_SUCCESS } from '../../actionConstants';

describe('fetchingReducers', () => {
  describe('SWITCH_NARROW', () => {
    test('resets state', () => {
      const initialState = deepFreeze({
        '[]': { older: true, newer: true },
      });

      const action = deepFreeze({
        type: SWITCH_NARROW,
        narrow: streamNarrow('some stream'),
      });

      const expectedState = {};

      const newState = fetchingReducers(initialState, action);

      expect(newState).toEqual(expectedState);
    });
  });

  describe('MESSAGE_FETCH_START', () => {
    test('if messages are fetched before or after the corresponding flag is set', () => {
      const initialState = deepFreeze({
        [homeNarrowStr]: { older: false, newer: false },
      });

      const action = deepFreeze({
        type: MESSAGE_FETCH_START,
        narrow: [],
        numBefore: 10,
        numAfter: 10,
      });

      const expectedState = {
        [homeNarrowStr]: { older: true, newer: true },
      };

      const newState = fetchingReducers(initialState, action);

      expect(newState).toEqual(expectedState);
    });

    test('if key for narrow does not exist, it is created and corresponding flags are set', () => {
      const initialState = deepFreeze({
        [homeNarrowStr]: { older: false, newer: false },
      });

      const action = deepFreeze({
        type: MESSAGE_FETCH_START,
        narrow: streamNarrow('some stream'),
        numBefore: 10,
        numAfter: 0,
      });

      const expectedState = {
        [homeNarrowStr]: { older: false, newer: false },
        [JSON.stringify(streamNarrow('some stream'))]: { older: true, newer: false },
      };

      const newState = fetchingReducers(initialState, action);

      expect(newState).toEqual(expectedState);
    });
  });

  describe('MESSAGE_FETCH_SUCCESS', () => {
    test('sets corresponding fetching flags to false, if messages are received before or after', () => {
      const initialState = deepFreeze({
        [homeNarrowStr]: { older: true, newer: true },
      });

      const action = deepFreeze({
        type: MESSAGE_FETCH_SUCCESS,
        narrow: [],
        messages: [{ id: 1 }],
        numBefore: 10,
        numAfter: 0,
      });

      const expectedState = {
        [homeNarrowStr]: { older: false, newer: true },
      };

      const newState = fetchingReducers(initialState, action);

      expect(newState).toEqual(expectedState);
    });
  });
});