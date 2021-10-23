import classNames from "classnames"
import { useEffect } from "react"
import { connect } from "react-redux"
import { asrHideText } from "../../pages/Asr/actions"
import { IMessagePart } from "../../pages/Asr/reducer"
import { geCurrentTimeSelector, getIsPlayningSelector } from "../../pages/Asr/selectors"

const ToggleText = ({dispatch,textKey, id, showContent, title, text, textArray, goToPlay, currentTime, isPlayning}: any & {textArray: IMessagePart[]}) => {

    const handleToogle = () => {
        dispatch(asrHideText({
            key: textKey,
            value: !showContent,
            id
        }))
    }
    const handleWordClick = (timestamp: number) => {
        goToPlay(timestamp);
    }

    const findeTimeStamp= (arr: any) => {
        const array = arr.filter((e: any) => e.timestamp <= currentTime);
        return array.length ? array[array.length - 1].timestamp : 0
    }


    return (
        <div className={classNames({"asr-result__body__item": true, open: showContent })} >
            <p className="asr-result__title" onClick={handleToogle}>{ title }</p>
            <div className={classNames({"asr-result__text": true })}>
                {showContent &&
                <div className="toggleContent">
                    { text ? text : 
                    textArray?.map((item: IMessagePart[], index: number) => {   
                        {return <div key={index} className={classNames({
                            'asr-result__cloud':item[0]?true:false,
                            'asr-result__cloud-second':item[0]?.channel==1
                        })}>
                            {item.map((el:IMessagePart, i:number)=>{
                            const timeStamp = findeTimeStamp(textArray);
                            let isActive = timeStamp == el.timestamp;
                            let classnamer = (isActive && isPlayning)|| (el?.selected) ? 'active' : ''
                                let nomargin = el.nomargin? 'nomargin' : '';
                            return (
                                <span className={`${classnamer} ${nomargin}`} key={i} onClick={() => handleWordClick(el.timestamp)}>{el.word}</span>
                            )
                        })}
                        </div>}
                            
                        }
                    )
            }</div>}
            </div>
        </div>
    )
}

const mapStateToProps = (state: any, props: any) => {
    const { id } = props;
    return {
      currentTime: geCurrentTimeSelector(state.asr, id),
      isPlayning: getIsPlayningSelector(state.asr, id)
    }
  }


export default connect(mapStateToProps)(ToggleText);
