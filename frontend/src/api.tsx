import axios from 'axios';

import {
  api,
  token,
} from './config';

export type Body = Record<string, unknown>;

const authorization = { Authorization: `Basic ${token}` };

export const post = (url: string, body: Body) => {
    return axios
      .post(`${url}`, body, { headers: authorization })
}

export const upload = (url: string, body: FormData) => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            ...authorization
        }
    }

    return axios
      .post(`${url}`, body, config)
}