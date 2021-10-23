import classNames from "classnames";
import React, {useEffect} from "react";
import Title from "../../layouts/Title";
import Sidebar from "../../layouts/tts/Sidebar";
import Message from "../../layouts/tts/Message";
import lottie from 'lottie-web';

import {getMessagesSelector} from './selectors';
import {connect} from "react-redux";


const Tts = ({messages}: any) => {
    useEffect(() => {
        const container = document.querySelector('.media__wave');
        if (!container?.querySelector('svg')) {
            lottie.loadAnimation({
                container: document.querySelector('.media__wave') as any,
                // the dom element that will contain the animation
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/media/wave.json' // the path to the animation json

            });
        }

    }, [true])
    return (
        <>
            <div className={classNames({
                'main': true,
                'open': messages?.length,
            })}
            >
                <Title title="Синтез речи NLab Speech" text=""/>
                <Sidebar/>
                <section className="tts_content">
                    <div className="tts_content__item">
                        {messages
                            ?.map((item: any, index: number) =>
                                <Message key={index} item={item} index={index}/>
                            )}
                    </div>
                </section>
            </div>
            <div className="media__wave"></div>
        </>


    )
}

const mapStateToProps = (state: any) => {
    return {
        messages: getMessagesSelector(state.tts)
    }
}
export default connect(mapStateToProps)(Tts);