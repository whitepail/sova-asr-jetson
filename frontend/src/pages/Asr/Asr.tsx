import classNames from 'classnames';
import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';

import Main from '../../layouts/asr/Main';
import Sidebar from '../../layouts/asr/Sidebar';
import Title from '../../layouts/Title';

import {getMessagesSelector} from './selectors';
import lottie from "lottie-web";

const Asr = ({messages}: any) => {
    const text = messages.length ? messages[0]?.textFilterd : '';
    const waveRef: any = useRef();
    useEffect(() => {
        lottie.loadAnimation({
            container: waveRef.current,
            // the dom element that will contain the animation
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/media/wave.json' // the path to the animation json

        });
    },[])
    return (
        <div>

            <div className={classNames({
                'main': true,
                'open': messages?.length,
            })}
            >
                <Title title="Распознавание речи из аудио/видео файлов"
                       text="Нажмите на изображение микрофона, запишите аудио, нажмите на изображение “на паузу” и дождитесь результата распознавания."/>
                <section className="asr_content">
                    <Sidebar/>
                    <Main/>
                </section>
            </div>
            {/*<p className="layer__text animate layer__animation" id="top">{text}</p>*/}
            {/*<p className="layer__text animate layer__animation" id="bottom">{text}</p>*/}
            <div className="media__wave" ref={waveRef}/>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        messages: getMessagesSelector(state.asr)
    }
}

export default connect(mapStateToProps)(Asr);