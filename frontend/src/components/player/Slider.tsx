import {useEffect, useRef, useState} from "react";

const Slider = ({min, max, step, onChange, value}: any) => {
    const scrollBox: any = useRef();
    let [afterComma, setAfterComma] = useState(2);

    if (value < min) {
        value = min
    }

    if (value > max) {
        value = max
    }


    useEffect(() => {
        const track = scrollBox.current.querySelector('[data-type=scrollbox-track]') as any;
        const trackBtn = scrollBox.current.querySelector('[data-type=scrollbox-btn]') as any;
        const trackWidth = track.getBoundingClientRect().width;
        const trackBtnWidth = trackBtn.getBoundingClientRect().width;
        const stepValue = step ? step : Math.round((max - min) / 100)
        const values: number[] = [];
        let prevValue = value ? value : 0;
        let iterator = (max - min) / stepValue
        const stepAfterComma = step.split('.');
        for (let x = 0; x <= iterator; x++) {
            values[x] = Math.round(stepValue * x * 100) / 100 + Number.parseFloat(min)
        }
        console.log(values)
        if (stepAfterComma.length) {
            setAfterComma(stepAfterComma[1].length);
        }

        scrollBox.current.addEventListener('click', function (e: any) {
            listener(e)
        });

        trackBtn.addEventListener('mousedown', function (e: any) {
            document.addEventListener('mousemove', listener);
        });

        document.addEventListener('mouseup', function (e: any) {
            document.removeEventListener('mousemove', listener);
        });

        const listener = function listener(e: any) {
            const posX = e.pageX;
            const trackPosWidth = track.getBoundingClientRect().x + trackWidth;
            let trackPercent = 100 - (trackPosWidth - posX) / trackWidth * 100;

            if (trackPercent > 100) {
                trackPercent = 100;
            }

            if (trackPercent < 0) {
                trackPercent = 0;
            }
            let nextPos = Math.round(values.length * trackPercent / 100)

            let offset = nextPos / values.length * trackWidth
            if (nextPos == 0) {
                nextPos++;
            }

            if (onChange) {
                onChange(+Number(values[nextPos - 1]).toFixed(afterComma));

                offset = offset - trackBtnWidth / 2

                trackBtn.style.left = offset + 'px';
                track.style.boxShadow = "inset ".concat(`${-(trackWidth - offset - trackBtnWidth / 2)}`, "px 0 rgb(255,255,255)");
            }
        };

        const percentWidth = trackWidth / 100;
        let percentValue = 0;

        const rangeValue = +max + Math.abs(min);

        percentValue = Math.abs(max) / 100;
        let add = 0;
        let initialValue = +value;

        if (min < 0) {
            percentValue = rangeValue / 100;
            if (value < 0) {
                value = (rangeValue / 2) - Math.abs(value);
                add = trackBtnWidth;
            } else {
                value = (rangeValue / 2) + value;
                add = 0;
            }
        }

        let leftPos = (percentWidth * value) / percentValue - trackBtnWidth;

        if (min <= 0) {
            leftPos = leftPos + (initialValue == 0 ? trackBtnWidth / 2 : add);
        }


    }, []);


    return (
        <div className="scrollbox" data-type="scrollbox" ref={(e) => (scrollBox.current = e)}>
            <div className="scrollbox__track" data-type="scrollbox-track">
                <div className="scrollbox__btn" data-type="scrollbox-btn">{Number(value)?.toFixed(afterComma)}</div>
            </div>
            <div className="scrollbox__bottom">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    )
}

export default Slider;