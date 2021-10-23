import {urlAsr} from '../../config';
import {
    ASR_CLEAR_MESSAGE,
    ASR_HIDE_TEXT,
    ASR_SEARCH,
    ASR_SET_CURRENT_TIME,
    ASR_SET_IS_PLAYNING,
    ASR_SET_STATUS,
    ASR_UPLOAD_FAILED,
    ASR_UPLOAD_STARTED,
    ASR_UPLOAD_SUCCESS
} from './actions';
import {v4 as uuidv4} from 'uuid';
import {createTextSpanFromBounds} from 'typescript';
import {resourceLimits} from 'node:worker_threads';

interface Action {
    payload: any;
    type: string;
}

export interface IMessagePart {
    word: string;
    timestamp: number;
    selected: boolean | null,
    channel: number,
    nomargin?: boolean;
}

export type TWords = IMessagePart[]

export interface IMessage {
    audio_url: string;
    doc: string;
    textFilterd: string;
    text: TWords[],
    textNotFiltred: string;
    textFiltredShow: boolean;
    textNotFiltredShow: boolean;
    isPlayning: boolean;
    recognition_time: number;
    currentTime: number;
    class: boolean;
    id: string;
}

export enum Status {
    start = 'start',
    loading = 'loading',
    pause = 'pause'
}

export interface IState {
    messages: IMessage[];
    messagesSelect: IMessage[]
    status: Status;
}

const initilState = {
    messages: [],
    messagesSelect: [],
    status: Status.start
}

export interface ISeacrh {
    end: number,
    start: number,
    message: number,
    phrase: number,
    matchedWord: string
}

const asr = (state: IState = initilState, action: Action) => {
    switch (action.type) {
        case ASR_SEARCH:
            let searchArr: string[] = action.payload.res.trim().toLowerCase().split(' ');
            let textMas: IMessage[] = JSON.parse(JSON.stringify(state.messagesSelect))
            if (action.payload.res.trim() == '') {
                return {
                    ...state,
                    messages: state.messagesSelect
                }
            }
            let results: ISeacrh[] = [];
            textMas.map((el, i) => {// array of messages
                el.text.slice().map((elText, iText) => { // array of phrases
                    let startPos: number = -1,
                        endPos: number = -1,
                        overlap = 0;
                    elText.slice().map((element, index) => { //array of words
                        if (element.word == searchArr[overlap]) {
                            if (searchArr.length == overlap + 1) {
                                endPos = index;
                                if (startPos == -1) {
                                    startPos = index;
                                }
                                results.push({
                                    message: i,
                                    phrase: iText,
                                    start: startPos,
                                    end: endPos,
                                    matchedWord: searchArr[overlap]
                                })
                                startPos = -1;
                                endPos = -1;
                            } else {
                                startPos = startPos == -1 ? index : startPos
                                overlap++;
                            }

                            startPos = startPos == -1 ? index : startPos
                        } else if (element.word.endsWith(searchArr[overlap]) && element.word != searchArr[overlap] && overlap == 0) {
                            startPos = startPos == -1 ? index : startPos
                            overlap++;
                            if (searchArr.length == 1) {
                                endPos = index;
                                results.push({
                                    message: i,
                                    phrase: iText,
                                    start: startPos,
                                    end: endPos,
                                    matchedWord: searchArr[overlap]
                                })
                                startPos = -1;
                                endPos = -1;
                            }
                        } else if (element.word.startsWith(searchArr[overlap]) && element.word != searchArr[overlap] && searchArr.length == overlap + 1) {
                            startPos = startPos == -1 ? index : startPos
                            endPos = index;
                            results.push({
                                message: i,
                                phrase: iText,
                                start: startPos,
                                end: endPos,
                                matchedWord: searchArr[overlap]
                            })
                            startPos = -1;
                            endPos = -1;

                        } else if (element.word.includes(searchArr[overlap]) && element.word != searchArr[overlap] && searchArr.length == 1) {
                            startPos = startPos == -1 ? index : startPos
                            endPos = index;
                            results.push({
                                message: i,
                                phrase: iText,
                                start: startPos,
                                end: endPos,
                                matchedWord: searchArr[overlap]
                            })
                            startPos = -1;
                            endPos = -1;
                        } else {
                            overlap = 0;
                            startPos = -1;
                            endPos = -1;
                        }
                    })
                })
            })
            let newTextMas: IMessage[] = [...textMas];
            results.map((el, index) => {
                let x = el.start,
                    end = el.end,
                    offset = 0;
                while (x <= end) {
                    let word = newTextMas[el.message].text[el.phrase][x + offset].word;
                    if (word === searchArr[x - el.start]) {
                        newTextMas[el.message].text[el.phrase][x + offset].selected = true;

                    } else {
                        let regExp = new RegExp(`(${searchArr[x-el.start]})`, 'g')
                        let splittedByMatch = word.split(regExp);
                        splittedByMatch = splittedByMatch.filter(el => el != '')
                        let template = {...newTextMas[el.message].text[el.phrase][x + offset]}
                        newTextMas[el.message].text[el.phrase].splice(x + offset, 1)
                        splittedByMatch.map((elem: any, i) => {
                            let prevWord = elem;
                            elem = {...template};
                            elem.word = prevWord;
                            if (prevWord == searchArr[x - el.start]) {
                                elem.selected = true;
                            }
                            if (i != splittedByMatch.length - 1) {
                                elem.nomargin = true
                            }
                            newTextMas[el.message].text[el.phrase].splice(x + i + offset, 0, elem);
                        })
                        offset = offset + splittedByMatch.length - 1;
                    }
                    x++;

                }
            })

            return {
                ...state,
                messages: [...newTextMas]
            }
            break;
        case ASR_UPLOAD_SUCCESS:
            let multichannel = false;

            if (action.payload?.r.length) {
                const [element] = action.payload.r;
                const message = element.response;
                console.log(message, element)
                if (!element?.response_audio_url) {
                    return {
                        ...state,
                        status: Status.start
                    }
                }

                let items: any = []
                message.map((el: any, i: number) => {
                    if (el.channel == 1) {
                        multichannel = true;
                    }
                    el.words = el.words.map((e: any) => {
                        e.channel = el.channel ? el.channel : 0
                        return e
                    })
                    items.push(el?.words)
                })

                if (multichannel) {
                    let response: any = [];
                    items.map((el: any) => {
                        response = response.concat(el)
                    })
                    response.sort((a: any, b: any) => {
                        if (a.timestamp > b.timestamp) {
                            return 1
                        } else {
                            return -1
                        }
                    })
                    items = [[]]
                    let currentChannel = response[0].channel,
                        currentIndex = 0;
                    response.map((el: any, i: number) => {
                        try {
                            if (el.channel == currentChannel) {
                                items[currentIndex].push(el)
                            } else {
                                currentIndex++;
                                currentChannel = el.channel;
                                items.push([])
                                items[currentIndex].push(el)
                            }
                        } catch (e) {
                        }
                    })
                }
                let filtredText: any = '';
                try {
                    element.response.map((el: any) => {
                        filtredText += el.text + ' '
                    })
                } catch (e) {
                }
                let item = {
                    doc: element?.response_docx_url,
                    audio_url: element?.response_audio_url,
                    textFilterd: filtredText,
                    text: items,
                    textNotFiltred: element?.response[0].word_timestamps?.map((e: IMessagePart) => e?.word).join(''),
                    recognition_time: element?.response[0].time,
                    textFiltredShow: true,
                    textNotFiltredShow: true,
                    currentTime: 0,
                    class: !!element?.response[0].class,
                    isPlayning: false,
                    id: uuidv4()
                }


                return {
                    ...state,
                    status: Status.start,
                    messages: [item, ...state.messagesSelect],
                    messagesSelect: [item, ...state.messagesSelect]
                }
            } else {
                return {
                    ...state,
                    status: Status.start
                };
            }
        case ASR_UPLOAD_STARTED:
            return {
                ...state,
                status: Status.loading
            }
        case ASR_UPLOAD_FAILED:
            return {
                ...state,
                status: Status.start
            }
        case ASR_SET_STATUS:
            return {
                ...state,
                status: action.payload.status
            }
        case ASR_CLEAR_MESSAGE:
            return {
                ...state,
                messages: []
            }
        case ASR_HIDE_TEXT:
            let messages = state.messages;
            if (action.payload?.id) {
                messages = state.messages.map((e, i) => {
                    if (action.payload.id === e.id) {
                        return ({...e, [action.payload.key]: action.payload.value})
                    }
                    return e;
                })
            } else {
                messages = state.messages.map(e => ({...e, [action.payload.key]: action.payload.value}))
            }
            return {
                ...state,
                messages
            }
        case ASR_SET_CURRENT_TIME:
            return {
                ...state,
                messages: state.messages.map((el) => {
                    if (el?.id === action.payload?.id) {
                        el.currentTime = action.payload?.time;
                    }
                    return el;
                })
            }

        case ASR_SET_IS_PLAYNING:
            return {
                ...state,
                messages: state.messages.map((el) => {
                    if (el?.id === action.payload?.id) {
                        el.isPlayning = action.payload?.isPlayning;
                    }
                    return el;
                })
            }
        default:
            return state
    }
}

export default asr;
