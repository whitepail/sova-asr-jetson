import {Dispatch} from 'react';

import {upload} from '../../api';
import {Status} from './reducer';

export const ASR_UPLOAD_STARTED = 'ASR_UPLOAD_STARTED';
export const ASR_UPLOAD_SUCCESS = 'ASR_UPLOAD_SUCCESS';
export const ASR_UPLOAD_FAILED = 'ASR_UPLOAD_FAILED';
export const ASR_SET_STATUS = 'ASR_SET_STATUS'
export const ASR_CLEAR_MESSAGE = 'ASR_CLEAR_MESSAGE'
export const ASR_HIDE_TEXT = 'ASR_HIDE_TEXT'
export const ASR_SET_CURRENT_TIME = 'ASR_SET_CURRENT_TIME'
export const ASR_SET_IS_PLAYNING = 'ASR_SET_IS_PLAYNING'
export const ASR_SEARCH = 'ASR_SEARCH'

/*interface IAsrUpload {
    audio_blob?: Blob;
    convert_digits: number;
    sample_rate: number;
    use_punctuation: number;
    include_breaks: number;
    timestamps: number;
    translate: number;
    restore_case: number;
    profanity_filter: number;
}*/


export const asrUpload = (params: any) => {
    return (dispatch: Dispatch<any>) => {
        dispatch(asrUplaodStarted());


        const data = new FormData();

        for (let field in params) {
            data.append(field, params[field]);
        }

        return upload('/asr', data)
            .then(res => {
                console.log(res);
                dispatch(asrUplaodSuccess(res.data));
            })
            .catch(err => {
                console.log(err);
                dispatch(asrUplaodFailed(err));
            });
    };
};

export const asrSetCurrentTime = (res: { time: number, id?: string }) => ({
    type: ASR_SET_CURRENT_TIME,
    payload: {
        ...res
    }
})

export const asrSetIsPlayning = (res: { isPlayning: boolean, id?: string }) => ({
    type: ASR_SET_IS_PLAYNING,
    payload: {
        ...res
    }
})

export const asrSearch = (res: string) => ({
    type: ASR_SEARCH,
    payload: {
        res
    }
})

export const asrHideText = (res: any) => ({
    type: ASR_HIDE_TEXT,
    payload: {
        ...res
    }
})

export const asrClearMessage = () => ({
    type: ASR_CLEAR_MESSAGE
})


export const asrUplaodStarted = () => ({
    type: ASR_UPLOAD_STARTED,
});

export const asrUplaodSuccess = (res: any) => ({
    type: ASR_UPLOAD_SUCCESS,
    payload: {
        ...res
    }
});

export const asrSetStatus = (res: { status: Status }) => ({
    type: ASR_SET_STATUS,
    payload: {
        ...res
    }
});

export const asrUplaodFailed = (error: string) => ({
    type: ASR_UPLOAD_FAILED,
    payload: {
        error
    }
});