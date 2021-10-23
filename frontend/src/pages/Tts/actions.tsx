import { Dispatch } from "react";
import { post, Body } from "../../api";

export const TTS_SEND_STARTED = "TTS_SEND_STARTED";
export const TTS_SEND_SUCCESS = "TTS_SEND_SUCCESS";
export const TTS_SEND_FAILED = "TTS_SEND_FAILED";

interface ISendPayload {
	pitch: number;
	rate: number;
	text: string;
	voice: any | string;
	volume: number;
}

export const ttsSend = (data: ISendPayload) => {
	return (dispatch: Dispatch<any>) => {
		data.voice?.map((el: any, i: number) => {
			if (el.picked) {
				let formData = { ...data };
				formData.voice = el.voiceFrom;
				dispatch(ttsSendStarted());
				return post("/synthesize/", {...formData,} as Body)
					.then((res) => {
                        if(!(res.data.response_code==0)){
                            throw new Error('wrong response')
                        }
						dispatch(
							ttsSendSuccess({
								...res.data,
								text: data.text, 
							})
						);
					})
					.catch((err) => {
						dispatch(ttsSendFailed(err));
					});
			}
		});
	};
};

export const ttsSendStarted = () => {
	return {
		type: TTS_SEND_STARTED,
	};
};

export const ttsSendSuccess = (res: any) => ({
	type: TTS_SEND_SUCCESS,
	payload: {
		...res,
	},
});

export const ttsSendFailed = (error: string) => ({
	type: TTS_SEND_FAILED,
	payload: {
		error,
	},
});
