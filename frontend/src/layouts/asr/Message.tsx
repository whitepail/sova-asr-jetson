import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Player from '../../components/player/PlayerNew';
import { asrSetCurrentTime, asrSetIsPlayning } from '../../pages/Asr/actions';

import {
  IMessage,
} from '../../pages/Asr/reducer';
import ToggleText from './ToggleText';


const Message = ({ dispatch, item, index }: { dispatch: any, item: IMessage, index: number }) => {
    const [audioValue, setAudioValue] = useState<number | null>(null);
    const handlePlayFrom = (time: number) => {
        console.log(time)
        setTimeout(() => {
            setAudioValue(null);
        }, 0);
        setTimeout(() => {
            setAudioValue(time);
        }, 1);
    }


    const handleCurrentTimeChange = (time: number) => {
        //setCurrentTime(time);
        dispatch(asrSetCurrentTime({time, id: item?.id}))
        //setAudioValue(time);
    }
 
    const handeStart = () => {
        dispatch(asrSetIsPlayning({isPlayning: true, id: item?.id}))

    }
    const handleEnd = () => {

        dispatch(asrSetIsPlayning({isPlayning: false, id: item?.id}))
    }
    return (
            /*</div><div><ReactAudioPlayer src={item.audio_url} controls={true} currentTime={audioValue} /></div>*/
        <div className="asr-result">
      
            <div className="asr-result__header">
                <Player src={item.audio_url} currentTime={audioValue} currentTimeChange={handleCurrentTimeChange} playStart={handeStart} playEnd={handleEnd} doc={item.doc} />
            </div>
            <div className="asr-result__body" data-type="body">
                <ToggleText title="Распознанный текст" id={item.id} textKey="textNotFiltredShow" index={index} showContent={item.textNotFiltredShow} textArray={item.text} 
                goToPlay={(e: any) => (handlePlayFrom(e))} />
                <ToggleText title="Фильтрованный текст" id={item.id} textKey="textFiltredShow" index={index} showContent={item.textFiltredShow} text={item.textFilterd} />
            </div>
            <div className="asr-result__footer">
                {item.class && <p className="asr-result__title result__title_auto">Автоответчик</p>}
                <p className="asr-result__title">Время распознавания</p>
                <p className="asr-result__title asr-result__time">{ Math.round(item.recognition_time*100)/100 }</p>
            </div>
        </div>
    )
}


 

export default connect()(Message);