import { createSelector } from 'reselect'
import { IState } from './reducer';

const getStatus = (state: IState) => state.status;
const getMessages = (state: IState) => state.messages;
const getMessagesSelect = (state: IState) => state.messagesSelect;
const getMessageId = (state: IState, id: string) => id

export const getMessagesSelector = createSelector(
  [getMessages],
  (messages) => messages
)
export const getMessagesSelectSelector = createSelector(
  [getMessagesSelect],
  (messagesSelect) => messagesSelect
)


export const geCurrentTimeSelector = createSelector(
  [getMessages, getMessageId],
  (messages, id) => messages?.length ? messages.find(e => e?.id === id)?.currentTime : undefined
)

export const getIsPlayningSelector = createSelector(
  [getMessages, getMessageId],
  (messages, id) => messages?.length ? messages.find(e => e?.id === id)?.isPlayning : false
)

export const getStatusSelector = createSelector(
    [getStatus],
    (status) => status
)