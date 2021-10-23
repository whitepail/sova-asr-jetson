import React, {DOMElement, useEffect, useRef, useState} from "react";

import lottie from "lottie-web";

import {connect} from "react-redux";
import {asrClearMessage, asrHideText, asrSearch} from "../../pages/Asr/actions";
import {getMessagesSelector, getMessagesSelectSelector} from "../../pages/Asr/selectors";

import Message from "./Message";

const Main = ({dispatch, messages, messagesSelect}: any) => {
    const [filtred, setFiltred] = useState();
    const content = useRef<HTMLDivElement>(null);
    const [showFiltered, setShowFilterd] = useState({
        textFiltredShow: {
            visible: true,
            text: ['Свернуть фильтрованный текст', 'Развернуть фильтрованный текст']
        },
        textNotFiltredShow: {
            visible: true,
            text: ['Свернуть распознанный текст', 'Развернуть распознанный текст']
        },
    });
    const handleFiltredChanged = (event: any) => {
        // setFiltred(event.target.value);
        dispatch(asrSearch(event.target.value))
    };

    const handleClear = () => {
        dispatch(asrClearMessage());
    };

    const handleHideText = (key: string) => {

        switch (key) {
            case "textFiltredShow":
                setShowFilterd({
                    ...showFiltered,
                    textFiltredShow: {
                        visible: !showFiltered.textFiltredShow.visible,
                        text: showFiltered.textFiltredShow.text.reverse(),
                    },
                });

                dispatch(
                    asrHideText({
                        key,
                        value: !showFiltered.textFiltredShow.visible,
                    })
                );
                break;
            case "textNotFiltredShow":
                setShowFilterd({
                    ...showFiltered,
                    textNotFiltredShow: {
                        visible: !showFiltered.textNotFiltredShow.visible,
                        text: showFiltered.textNotFiltredShow.text.reverse(),
                    },
                });
                dispatch(
                    asrHideText({
                        key,
                        value: !showFiltered.textNotFiltredShow.visible,
                    })
                );
                break;
        }
    };


    useEffect(() => {
        if (content.current) {
            content.current.scrollTo(0, 0)
        }
        const asrRightside = document.querySelector('.asr_content__item.rightside');
        const asrContent = document.querySelector('[data-type="content"]');
        const ttsContent = document.querySelector('.tts_content__item');

        if (asrContent && asrRightside) {
            asrContent.addEventListener("DOMNodeInserted", () => {
                if (scrollbarVisible(asrContent)) {
                    !asrRightside.classList.contains('scroll') && asrRightside.classList.add('scroll');
                } else {
                    asrRightside.classList.contains('scroll') && asrRightside.classList.remove('scroll');
                }
            }, false);
        }

        if (ttsContent) {
            ttsContent.addEventListener("DOMNodeInserted", () => {
                if (scrollbarVisible(ttsContent)) {
                    !ttsContent.classList.contains('scroll') && ttsContent.classList.add('scroll');
                } else {
                    ttsContent.classList.contains('scroll') && ttsContent.classList.remove('scroll');
                }
            }, false);
        }

        function scrollbarVisible(element: any) {
            return element.scrollHeight > element.clientHeight;
        }
    }, [messages])
    return (
        <div className="asr_content__item rightside">
            <div className="asr-filter">
                {/*<input*/}
                {/*    type="text"*/}
                {/*    className="asr-filter__input"*/}
                {/*    placeholder="Поиск"*/}
                {/*    onChange={handleFiltredChanged}*/}
                {/*/>*/}

                <div
                    className="asr-filter__btn"
                    onClick={() =>
                        handleHideText(
                            "textNotFiltredShow"
                        )
                    }>
                    {showFiltered.textNotFiltredShow.text[0]}
                </div>
                <div
                    className="asr-filter__btn"
                    onClick={() =>
                        handleHideText(
                            "textFiltredShow"
                        )
                    }>
                    {showFiltered.textFiltredShow.text[0]}

                </div>
                <div
                    className="asr-filter__btn"
                    onClick={handleClear}>
                    Очистить
                </div>
            </div>
            <div className="asr_content__body" data-type="content" ref={content}>
                {messages.map((item: any, index: number) => {
                        return (<Message key={item.id} item={item} index={index}/>)

                    }
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        messages: getMessagesSelector(state.asr),
        messagesSelect: getMessagesSelector(state.asr)
    };
};

export default connect(mapStateToProps)(Main);
