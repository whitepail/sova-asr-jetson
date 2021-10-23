import React, {
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState,
} from 'react';

import lottie from 'lottie-web';

import Girl from '../../assets/girl.png'
import GirlWebp from '../../assets/girl.webp'

import Heands from '../../assets/heands.png'
import HeandsWebp from '../../assets/heands.webp'


import classNames from "classnames";

import {
    ReactMic,
} from 'react-mic';
import {connect, useSelector} from 'react-redux';

import {asrSetStatus, asrUpload} from '../../pages/Asr/actions';
import {Status} from '../../pages/Asr/reducer';

export const formReducer = (state: any, event: any) => {
    return {
        ...state,
        [event.name]: event.value
    }
}

const initial = {
    convert_digits: 1,
    use_punctuation: 1,
    translate: 1,
    classify: 1,
    restore_case: 1,
    profanity_filter: 1,
    include_breaks: 1,
    sample_rate: '16000',
    decoder_name: 'trie',
    audio_blob: null,
    split_channels: 1,
}


const Sidebar = ({dispatch}: any) => {
    const [formData, setFormData] = useReducer(formReducer, initial);
    const status = useSelector((state: any) => state.asr.status);
    const inputRef: any = useRef();

    const handleSubmit = (data: any, event?: any) => {
        event?.preventDefault();
        dispatch(asrUpload(data));
    }

    const handleChangeCheckbox = (event: any) => {
        setFormData({
            name: event.target.name,
            value: +event.nativeEvent.target.checked,
        });
    }

    const handleChange = (event: any) => {
        setFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }

    const handleFileChange = (event: any) => {
        handleSubmit({...formData, audio_blob: event.target.files[0]}, event)
        lottie.play()
        setTimeout(() => {
            setFormData({
                name: 'audio_blob',
                value: "",
            });
        }, 0);
    }
    const handleFileDrop = (event: any) => {
        event.stopPropagation()
        event.preventDefault()
        handleSubmit({...formData, audio_blob: event.dataTransfer.files[0]}, event)
        lottie.play()
    }
    const blobToFile = (theBlob: Blob, fileName: string) => {
        let b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;
        return theBlob as File;
    }

    const handleClickRecord = () => {
        lottie.play()
        if (status !== 'loading') {
            dispatch(asrSetStatus({status: status === Status.pause ? Status.start : Status.pause}))
        }
    }

    useEffect(() => {
        lottie.loadAnimation({
            container: document.querySelector('.media__elisa') as any,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: '/media/elisa.json'
        });
        lottie.setSpeed(.7)
    }, []);

    useEffect(() => {
        Object.assign(window, {globalFormChange: formData});
    }, [formData]);


    const recordStop = (data: any) => {
        handleSubmit({...(window as any).globalFormChange, audio_blob: blobToFile(data.blob, 'audio')})
    }


    return (
        <div className="asr_content__item leftside">

            <ReactMic
                record={status === 'pause'}
                onStop={recordStop}
                className="vizulazer"
            />
            <div className="asr">
                <form className="asr__form" onSubmit={e => handleSubmit(formData, e)}>

                    <div className="form__btn">
                        <div
                            className={classNames({
                                'asr-btn': true,
                                'asr-btn-start': status === 'start',
                                'asr-btn-loading': status === 'loading',
                                'asr-btn-pause': status === 'pause',
                            })}
                            onClick={() => handleClickRecord()}
                        >
                            <svg className="spinner" viewBox="0 0 50 50">
                                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="6"></circle>
                                <defs>
                                    <linearGradient id="paint0_linear" x1="30" y1="0" x2="30" y2="60"
                                                    gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#7819A1"/>
                                        <stop offset="1" stopColor="#C52185"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    <div className="asr__drop__wrapper">
                        <div className="asr__drop" onDrop={handleFileChange}>
                            <input ref={inputRef} type="file" name="audio_blob" id="file" onChange={handleFileChange}
                                   onDrop={e => handleFileDrop(e)} value={formData.audio_blob}/>
                            <div className="drop__overlay">
                                <p className="overlay__text">Нажмите сюда {formData.audio_blob}
                                    <br/>или перетащите файл</p>
                                <picture>
                                    <source
                                        srcSet="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNiAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI2Ljk5OTUgMTEuNTk5OEgyMS41OTk1VjAuNzk5ODA1SDE0LjM5OTVWMTEuNTk5OEg4Ljk5OTUzTDE3Ljk5OTUgMjAuNTk5OEwyNi45OTk1IDExLjU5OThaTTM0LjgwNzkgMjMuMzU3NEMzNC40Mjk5IDIyLjk1NDIgMzEuOTA4MSAyMC4yNTYgMzEuMTg4MSAxOS41NTIyQzMwLjY4MzYgMTkuMDY4NSAzMC4wMTE0IDE4Ljc5ODkgMjkuMzEyNSAxOC43OTk4SDI2LjE0OTlMMzEuNjY1MSAyNC4xODlIMjUuMjg1OUMyNS4xOTkyIDI0LjE4NzQgMjUuMTEzNiAyNC4yMDg3IDI1LjAzNzggMjQuMjUwN0MyNC45NjIgMjQuMjkyOCAyNC44OTg1IDI0LjM1NCAyNC44NTM5IDI0LjQyODRMMjMuMzg1MSAyNy43OTk4SDEyLjYxMzlMMTEuMTQ1MSAyNC40Mjg0QzExLjEwMDIgMjQuMzU0MyAxMS4wMzY4IDI0LjI5MzIgMTAuOTYxIDI0LjI1MTJDMTAuODg1MiAyNC4yMDkyIDEwLjc5OTggMjQuMTg3OCAxMC43MTMxIDI0LjE4OUg0LjMzMzkzTDkuODQ3MzMgMTguNzk5OEg2LjY4NjUzQzUuOTcxOTMgMTguNzk5OCA1LjI4OTczIDE5LjA4NiA0LjgxMDkzIDE5LjU1MjJDNC4wOTA5MyAyMC4yNTc4IDEuNTY5MTMgMjIuOTU2IDEuMTkxMTMgMjMuMzU3NEMwLjMxMDkyNiAyNC4yOTUyIC0wLjE3MzI3NCAyNS4wNDIyIDAuMDU3MTI2MyAyNS45NjU2TDEuMDY2OTMgMzEuNDk4OEMxLjI5NzMzIDMyLjQyNCAyLjMxMDczIDMzLjE4MzYgMy4zMjA1MyAzMy4xODM2SDMyLjY4MjFDMzMuNjkxOSAzMy4xODM2IDM0LjcwNTMgMzIuNDI0IDM0LjkzNTcgMzEuNDk4OEwzNS45NDU1IDI1Ljk2NTZDMzYuMTcyMyAyNS4wNDIyIDM1LjY4OTkgMjQuMjk1MiAzNC44MDc5IDIzLjM1NzRaIiBmaWxsPSIjMTYxOTNCIi8+Cjwvc3ZnPgo="
                                        type="image/webp"/>
                                    <img
                                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNiAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI2Ljk5OTUgMTEuNTk5OEgyMS41OTk1VjAuNzk5ODA1SDE0LjM5OTVWMTEuNTk5OEg4Ljk5OTUzTDE3Ljk5OTUgMjAuNTk5OEwyNi45OTk1IDExLjU5OThaTTM0LjgwNzkgMjMuMzU3NEMzNC40Mjk5IDIyLjk1NDIgMzEuOTA4MSAyMC4yNTYgMzEuMTg4MSAxOS41NTIyQzMwLjY4MzYgMTkuMDY4NSAzMC4wMTE0IDE4Ljc5ODkgMjkuMzEyNSAxOC43OTk4SDI2LjE0OTlMMzEuNjY1MSAyNC4xODlIMjUuMjg1OUMyNS4xOTkyIDI0LjE4NzQgMjUuMTEzNiAyNC4yMDg3IDI1LjAzNzggMjQuMjUwN0MyNC45NjIgMjQuMjkyOCAyNC44OTg1IDI0LjM1NCAyNC44NTM5IDI0LjQyODRMMjMuMzg1MSAyNy43OTk4SDEyLjYxMzlMMTEuMTQ1MSAyNC40Mjg0QzExLjEwMDIgMjQuMzU0MyAxMS4wMzY4IDI0LjI5MzIgMTAuOTYxIDI0LjI1MTJDMTAuODg1MiAyNC4yMDkyIDEwLjc5OTggMjQuMTg3OCAxMC43MTMxIDI0LjE4OUg0LjMzMzkzTDkuODQ3MzMgMTguNzk5OEg2LjY4NjUzQzUuOTcxOTMgMTguNzk5OCA1LjI4OTczIDE5LjA4NiA0LjgxMDkzIDE5LjU1MjJDNC4wOTA5MyAyMC4yNTc4IDEuNTY5MTMgMjIuOTU2IDEuMTkxMTMgMjMuMzU3NEMwLjMxMDkyNiAyNC4yOTUyIC0wLjE3MzI3NCAyNS4wNDIyIDAuMDU3MTI2MyAyNS45NjU2TDEuMDY2OTMgMzEuNDk4OEMxLjI5NzMzIDMyLjQyNCAyLjMxMDczIDMzLjE4MzYgMy4zMjA1MyAzMy4xODM2SDMyLjY4MjFDMzMuNjkxOSAzMy4xODM2IDM0LjcwNTMgMzIuNDI0IDM0LjkzNTcgMzEuNDk4OEwzNS45NDU1IDI1Ljk2NTZDMzYuMTcyMyAyNS4wNDIyIDM1LjY4OTkgMjQuMjk1MiAzNC44MDc5IDIzLjM1NzRaIiBmaWxsPSIjMTYxOTNCIi8+Cjwvc3ZnPgo="
                                        className="overlay__upload" alt="upload"/>
                                </picture>
                            </div>
                        </div>
                    </div>
                    <div className="asr__btns">
                        <div className="asr__btn__item">
                            <label className="checkbox__item">
                                <input name="convert_digits" checked={true} type="checkbox"
                                       onChange={handleChangeCheckbox}/>
                                <span className="asr-checkbox"></span> <span
                                className="checkbox__text">Перевод чисел</span> </label>
                        </div>
                        <div className="asr__btn__item">
                            <label className="checkbox__item">
                                <input name="use_punctuation" checked={true} type="checkbox"
                                       onChange={handleChangeCheckbox}/>
                                <span className="asr-checkbox"></span> <span
                                className="checkbox__text">Пунктуация</span> </label>
                        </div>
                        <div className="asr__btn__item">
                            <label className="checkbox__item">
                                <input name="translate" checked={true} type="checkbox"
                                       onChange={handleChangeCheckbox}/>
                                <span className="asr-checkbox"></span> <span className="checkbox__text">Перевод англоязычных названий</span>
                            </label>
                        </div>
                        <div className="asr__btn__item">
                            <label className="checkbox__item">
                                <input name="restore_case" checked={true} type="checkbox"
                                       onChange={handleChangeCheckbox}/>
                                <span className="asr-checkbox"></span> <span className="checkbox__text">Соблюдение верхнего регистра</span>
                            </label>
                        </div>
                        <div className="asr__btn__item">
                            <label className="checkbox__item">
                                <input name="profanity_filter" checked={true} type="checkbox"
                                       onChange={handleChangeCheckbox}/>
                                <span className="asr-checkbox"></span> <span className="checkbox__text">Мат</span>
                            </label>
                        </div>
                        <div className="asr__btn__item">
                            <label className="checkbox__item">
                                <input name="classify" checked={true} type="checkbox"
                                       onChange={handleChangeCheckbox}/>
                                <span className="asr-checkbox"></span> <span className="checkbox__text">Определить автоответчик</span>
                            </label>
                        </div>
                        <div className="asr__btn__item">
                            <label className="checkbox__item">
                                <input name="include_breaks" checked={true} type="checkbox"
                                       onChange={handleChangeCheckbox}/>
                                <span className="asr-checkbox"></span> <span className="checkbox__text">Интервалы распознаваний</span>
                            </label>
                        </div>
                        <div className="asr__btn__item">
                            <label className="checkbox__item">
                                <input name="split_channels" checked={true} type="checkbox"
                                       onChange={handleChangeCheckbox}/>
                                <span className="asr-checkbox"></span> <span className="checkbox__text">Разбивка диалогов</span>
                            </label>
                        </div>
                    </div>
                    <div className="asr__codec">
                        <div className="codec__item kgc">
                            <p className="codec__title">кГц</p>
                            <div className="codec__values">
                                <label
                                    className={classNames({
                                        'codec__value': true,
                                        'active': formData.sample_rate == '16000',
                                    })}
                                >
                                    <input type="radio" name="sample_rate" value="16000" onClick={handleChange}/>
                                    <span>16000</span>
                                </label>

                                <label
                                    className={classNames({
                                        'codec__value': true,
                                        'active': formData.sample_rate == '8000',
                                    })}
                                >
                                    <input type="radio" name="sample_rate" value="8000" onClick={handleChange}/>
                                    <span>8000</span>
                                </label>
                            </div>
                        </div>
                        <div className="codec__item decoder">
                            <p className="codec__title">Декодер</p>
                            <div className="codec__values">
                                <label
                                    className={classNames({
                                        'codec__value': true,
                                        'active': formData.decoder_name == 'greedy',
                                    })}
                                >
                                    <input type="radio" name="decoder_name" value="greedy" onClick={handleChange}/>
                                    <span>Жадный</span>
                                </label>

                                <label
                                    className={classNames({
                                        'codec__value': true,
                                        'active': formData.decoder_name == 'trie',
                                    })}
                                >
                                    <input type="radio" name="decoder_name" value="trie" onClick={handleChange}/>
                                    <span>Trie</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="elisa">
                        <div className="asr__girl">
                            <picture>
                                <source srcSet={GirlWebp} type="image/webp"/>
                                <img className="girl" src={Girl} alt="girl"/></picture>
                        </div>
                        <div className="asr__heands">
                            <picture>
                                <source srcSet={HeandsWebp} type="image/webp"/>
                                <img className="heands" src={Heands} alt="heands"/></picture>
                        </div>
                        <div className="media__elisa"></div>
                    </div>
                </form>
            </div>

        </div>
    )
}


export default connect()(Sidebar)