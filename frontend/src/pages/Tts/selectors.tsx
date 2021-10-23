import { createSelector } from 'reselect'
import { IState } from './reducer';

const getLoading = (state: IState) => state.loading;
const getMessages = (state: IState) => state.messages;

export const getMessagesSelector = createSelector(
  [getMessages],
  (messages) => messages
)


export const getLoadingSelector = createSelector(
    [getLoading],
    (loading) => loading
)