import lottie from "lottie-web";

import Girl from "../../assets/girl.png";
import GirlWebp from "../../assets/girl.webp";
import Pins from "../../assets/pin.gif";

import Heands from "../../assets/heands.png";
import HeandsWebp from "../../assets/heands.webp";

import Face1 from "../../assets/face_1.png";
import Face1Webp from "../../assets/face_1.webp";

import Face2 from "../../assets/face_2.png";
import Face2Webp from "../../assets/face_2.webp";

import React, {useEffect, useReducer, useState, useRef} from "react";
import {ttsSend} from "../../pages/Tts/actions";
import {formReducer} from "../asr/Sidebar";
import {connect} from "react-redux";
import classNames from "classnames";
import Slider from "../../components/player/Slider";
import {getLoadingSelector} from "../../pages/Tts/selectors";

const initial = {
    pitch: 1,
    rate: 1,
    text: "",
    voice: [
        {
            voiceFrom: "Natasha",
            picked: true,
        },
        // {
        // 	voiceFrom: "Ruslan",
        // 	picked: false,
        // },
        {
            voiceFrom: "Artem",
            picked: true,
        },
    ],
    volume: 0,
};

const Sidebar = ({dispatch, loading}: any) => {
    const [formData, setFormData] = useReducer(formReducer, initial);
    const [formText, setFormText] = useState('')
    const body = useRef<HTMLDivElement>(null);
    useEffect(() => {
        lottie.loadAnimation({
            container: document.querySelector(
                ".media__elisa"
            ) as any,
            // the dom element that will contain the animation
            renderer: "svg",
            loop: true,
            autoplay: false,
            path: "/media/elisa.json", // the path to the animation json
        });
        lottie.setSpeed(.6)
    }, []);

    const handleSubmit = (event?: any) => {
        if (event.which == 13 && !loading) {
            event?.preventDefault();
            dispatch(ttsSend(formData));
        }
    };
    const submitWithButton = () => {
        dispatch(ttsSend(formData));
    }
    const handleChange = (event: any) => {
        lottie.play()
        setFormData({
            name: event.target.name,
            value: event.target.value,
        });
    };
    const handleSliderChange = (v: any, name: string) => {
        setFormData({
            name,
            value: v,
        });
    };

    const handleChangeVoice = (name: any) => {
        let newData = formData.voice;
        newData.map((el: any, i: number) => {
            if (el.voiceFrom == name) {
                el.picked = !el.picked;
            }
        });
        setFormData({
            name: "voice",
            value: newData,
        });
    };

    return (
        <section className="tts_start">
            <div className="tts">
                <div className="tts-textarea">
					<textarea
                        disabled={loading}
                        name="text"
                        id="string"
                        placeholder="Введите текст, выберите голос, настройте тон, скорость и громкость и нажмите синтезировать"
                        onKeyPress={handleSubmit}
                        onChange={(e) => {
                            handleChange(e);
                            setFormText(e.target.value)

                        }
                        }></textarea>
                    <div className="disabled__text">
                        Обработка{" "}
                        <img
                            className="pins"
                            src={Pins}
                        />
                    </div>
                    <div className="elisa">
                        <div className="asr__girl">
                            <picture>
                                <source
                                    srcSet={
                                        GirlWebp
                                    }
                                    type="image/webp"
                                />
                                <img
                                    className="girl"
                                    src={
                                        Girl
                                    }
                                    alt="girl"
                                />
                            </picture>
                        </div>
                        <div className="asr__heands">
                            <picture>
                                <source
                                    srcSet={
                                        HeandsWebp
                                    }
                                    type="image/webp"
                                />
                                <img
                                    className="heands"
                                    src={
                                        Heands
                                    }
                                    alt="heands"
                                />
                            </picture>
                        </div>
                        <div className="media__elisa"></div>
                    </div>
                </div>
                <div className="tts-sidebar">
                    <div className="tts__header">
                        <div
                            className={classNames({
                                tts__avatar:
                                    true,
                                active: formData
                                    ?.voice[0]
                                    .picked,
                            })}
                            onClick={() =>
                                handleChangeVoice(
                                    "Natasha"
                                )
                            }>
                            <picture>
                                <source
                                    srcSet={
                                        Face1Webp
                                    }
                                    type="image/webp"
                                />
                                <img
                                    src={
                                        Face1
                                    }
                                    alt="Наташа"
                                    className="tts__picture"
                                />
                            </picture>
                            <p className="tts__name">
                                Наташа
                            </p>
                        </div>
                        {/*<div*/}
                        {/*	className={classNames({*/}
                        {/*		tts__avatar:*/}
                        {/*			true,*/}
                        {/*		active: formData*/}
                        {/*			?.voice[1]*/}
                        {/*			.picked,*/}
                        {/*	})}*/}
                        {/*	onClick={() =>*/}
                        {/*		handleChangeVoice(*/}
                        {/*			"Ruslan"*/}
                        {/*		)*/}
                        {/*	}>*/}
                        {/*	<picture>*/}
                        {/*		<source*/}
                        {/*			srcSet={*/}
                        {/*				Face2Webp*/}
                        {/*			}*/}
                        {/*			type="image/webp"*/}
                        {/*		/>*/}
                        {/*		<img*/}
                        {/*			src={*/}
                        {/*				Face2*/}
                        {/*			}*/}
                        {/*			alt="Руслан"*/}
                        {/*			className="tts__picture"*/}
                        {/*		/>*/}
                        {/*	</picture>*/}
                        {/*	<p className="tts__name">*/}
                        {/*		Руслан*/}
                        {/*	</p>*/}
                        {/*</div>*/}
                        <div
                            className={classNames({
                                tts__avatar:
                                    true,
                                active: formData
                                    ?.voice[1]
                                    .picked,
                            })}
                            onClick={() =>
                                handleChangeVoice(
                                    "Artem"
                                )
                            }>
                            <picture>
                                <source
                                    srcSet={
                                        Face2Webp
                                    }
                                    type="image/webp"
                                />
                                <img
                                    src={
                                        Face2
                                    }
                                    alt="Руслан"
                                    className="tts__picture"
                                />
                            </picture>
                            <p className="tts__name">
                                Aртем
                            </p>
                        </div>
                    </div>
                    <div className="tts__body" ref={body}>
                        <div className="scrollbox__item">
                            <p className="scrollbox__name">
                                Тон
                            </p>
                            <Slider
                                min="0.75"
                                max="1.5"
                                step="0.05"
                                value={
                                    formData?.pitch
                                }
                                onChange={(
                                    e: any
                                ) =>
                                    handleSliderChange(
                                        e,
                                        "pitch"
                                    )
                                }
                            />
                        </div>
                        <div className="scrollbox__item">
                            <p className="scrollbox__name">
                                Скорость
                            </p>
                            <Slider
                                min="0.5"
                                max="2.0"
                                step="0.1"
                                value={
                                    formData?.rate
                                }
                                onChange={(
                                    e: any
                                ) =>
                                    handleSliderChange(
                                        e,
                                        "rate"
                                    )
                                }
                            />
                        </div>
                        <div className="scrollbox__item">
                            <p className="scrollbox__name">
                                Громкость
                            </p>
                            <Slider
                                min="-12"
                                max="12"
                                step="0.5"
                                value={
                                    formData?.volume
                                }
                                onChange={(
                                    e: any
                                ) =>
                                    handleSliderChange(
                                        e,
                                        "volume"
                                    )
                                }
                            />
                        </div>
                        <button className="tts__submit" onClick={submitWithButton}
                                disabled={(formText.length == 0) ? true : false}>
							<span>
								Синтезировать
							</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
// <input type="range" min="0.75" max="1.5" step="0.05"  name="pitch" onChange={handleChange} />
const mapStateToProps = (state: any) => {
    return {
        loading: getLoadingSelector(state.tts),
    };
};

export default connect(mapStateToProps)(Sidebar);
