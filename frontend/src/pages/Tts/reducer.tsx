import { urlSynthesis } from '../../config';
import {
  TTS_SEND_FAILED,
  TTS_SEND_STARTED,
  TTS_SEND_SUCCESS
} from './actions';

interface Action {
    payload: any;
    type: string;
}

export interface IMessagePart {
  word: string;
  timestamp: number;
}

export interface IMessage {
    duration_s: number,
    response_audio: string,
    response_audio_url: string,
    response_docx_url: string,
    sample_rate: number,
    synthesis_time: number,
    voice: string;
    text: string
}

export interface IState {
  messages: IMessage[];
  loading: boolean;
}

const initilState = {
  messages: [],
  loading: false
}

const asr = (state: IState = initilState, action: Action) => {
    switch (action.type) {
      case TTS_SEND_SUCCESS:

        if(action.payload?.response.length){
          const [ message ] = action.payload.response;
          const item = {
            duration_s: message?.duration_s,
            response_audio: message?.response_audio_url,
            response_docx_url: message?.response_docx_url,
            response_audio_url: urlSynthesis + message?.response_audio_url,
            sample_rate: message?.sample_rate,
            synthesis_time: message?.synthesis_time,
            text: action?.payload?.text,
            voice: message?.voice
          }

          return {
            ...state,
            loading: false,
            messages: [item, ...state.messages]
          }
        } else {
          return {
            ...state
          };
        }
      case TTS_SEND_FAILED:
        return {
          ...state,
          loading: false
        }
        case TTS_SEND_STARTED:
            return {
              ...state,
              loading: true
            }
      default:
        return state
    }
  }

export default asr;