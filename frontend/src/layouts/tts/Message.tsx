import React from 'react';
import Face1 from '../../assets/face_1.png'
import Face1Webp from '../../assets/face_1.webp'
import Player from '../../components/player/PlayerNew';

import Face2 from '../../assets/face_2.png'
import Face2Webp from '../../assets/face_2.webp'

import Face3 from '../../assets/face_3.png'
import Face3Webp from '../../assets/face_3.webp'

const Message = ({ item }: any) => {
    const avatars: any = {
        'Natasha': {
            avatar: {
                png: Face1,
                webp: Face1Webp,
            },
            name: 'Наташа'
        },
        'Ruslan': {
            avatar: {
                png: Face2,
                webp: Face2Webp,
            },
            name: 'Руслан'
        },
        'Artem': {
            avatar: {
                png: Face2,
                webp: Face2Webp,
            },
            name: 'Артем'
        }
    }
    return (

        <div className="tts-result">
        <div className="tts-result__header">
            <Player src={item.response_audio_url} isBig={true} />
        </div>
        <div className="tts-result__body">
            <div className="tts-result__avatar">
                <picture><source srcSet={avatars[item.voice]?.avatar.webp} type="image/webp" /><img className="avatar__picture" src={avatars[item.voice]?.avatar.png} alt="face_1" /></picture>
                <p className="avatar__name">{avatars[item.voice]?.name}</p>
            </div>
            <div className="tts-result__body__item">
                <div className="tts-result__text">{item?.text}</div>
            </div>
        </div>
        <div className="tts-result__footer">
            <p className="tts-result__title">Время генерации</p>
            <p className="tts-result__title tts-result__time">{Math.round(item?.synthesis_time*10)/10}</p>
        </div>
    </div>
    )
}

export default Message;
