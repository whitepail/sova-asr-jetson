import classNames from "classnames";
import {useEffect, useRef} from "react";

const Player = ({src, currentTime, currentTimeChange, isBig, playStart, playEnd, doc}: any) => {

    const contaniner = useRef() as any;
    let audioPlayer: any = useRef();


    useEffect(() => {
        var play = contaniner.current.querySelector('.track__play') as Element;
        var volume = contaniner.current.querySelector('.track__volume') as Element;
        var road = contaniner.current.querySelector('[data-type=track_fill]');
        var audioDuration = contaniner.current.querySelector('[data-type=duration]');
        var audioTime = contaniner.current.querySelector('[data-type=time]');

        road.classList.remove('w-100')

        if (play) {
            play.addEventListener('click', function (e: any) {
                var btn = e.target;
                if (!btn.classList.contains('pause')) {
                    btn.classList.add('pause')

                } else {
                    btn.classList.remove('pause');
                }
            });

        }


        if (volume) {
            volume.addEventListener('click', function (e: any) {
                var btn = e.target;
                var volumeInput = btn.parentNode.querySelector('[data-type=volume_range]');


                if (!btn.classList.contains('mute')) {
                    btn.classList.add('mute');
                    volumeInput.dataset.volume = volumeInput.value;
                    volumeInput.value = 0;
                } else {
                    btn.classList.remove('mute');
                    volumeInput.value = volumeInput.dataset.volume;
                }
            });

        }


        if (contaniner.current) {
            audioPlayer.current.addEventListener('pause', () => {

                let percent = window.getComputedStyle(road).getPropertyValue('width')
                road.classList.remove('w-100')
                road.style.width = percent

            })


            audioPlayer.current.addEventListener('play', () => {
                road.style.transition = `all ${Math.abs(Math.round((audioPlayer.current.currentTime - audioPlayer.current.duration) * 10) / 10)}s linear`
                road.style.width = ''
                road.classList.add('w-100')
            })
            audioPlayer.current.addEventListener('playing', () => {
                const btn = contaniner.current.querySelector('[data-type=btn]')
                if (!btn.classList.contains('pause')) {
                    btn.classList.add('pause')
                }
                if (playStart) {
                    playStart();
                }
            });

//            audioPlayer = contaniner.current.querySelector('[data-id=audio]');


            if (audioDuration) {
                audioPlayer.current.onloadedmetadata = function (e: any) {
                    audioDuration.innerHTML = Math.round(Number.parseFloat(e.target.duration) * 10) / 10;
                };
            }

            audioPlayer.current.addEventListener('ended', (e: any) => {
                play?.classList?.remove('pause')
                audioPlayer.current.currentTime = 0;
                currentTime = 0;
                if (audioTime) {
                    audioTime.innerText = 0
                }
                road.classList.remove('w-100')
                road.style.transition = ''
                road.style.width = ''
                audioPlayer.current.pause();

                if (playEnd) {
                    playEnd();
                }
            });

            var roadLn = contaniner.current.querySelector('[data-type=track]');
            var volumeRange = contaniner.current.querySelector('[data-type=volume_range]');
            var volumeIcon = contaniner.current.querySelector('[data-type=volume]');


            if (volumeRange) {
                volumeRange.addEventListener('input', function (e: any) {
                    var volume = e.target.value;
                    audioPlayer.current.volume = volume / 100;

                    if (volume == 0) {
                        volumeIcon.classList.contains('mute') || volumeIcon.classList.add('mute');
                    } else {
                        !volumeIcon.classList.contains('mute') || volumeIcon.classList.remove('mute');
                    }
                });
            }

            contaniner.current.addEventListener('click', function (e: any) {

                var currentBtn = e.target;
                var currentBtnType = currentBtn.dataset.type;

                if (currentBtnType != 'download') {
                    e.preventDefault()
                }

                var trackPositionX = e.pageX;

                switch (currentBtnType) {
                    case 'btn': {
                        if (currentBtn.classList.contains('pause')) {
                            audioPlayer.current.play();
                        } else {
                            audioPlayer.current.pause();
                        }
                    }
                        break;

                    case 'volume': {
                        currentBtn.classList.contains('mute') ? audioPlayer.current.muted = true : audioPlayer.current.muted = false;
                    }
                        break;

                    case 'volume_range': {
                        audioPlayer.current.muted = false;
                    }
                        break;

                    case 'track': {
                        var trackWidth = currentBtn.getBoundingClientRect().x + currentBtn.getBoundingClientRect().width;
                        var trackPercent = 100 - (trackWidth - trackPositionX) / currentBtn.getBoundingClientRect().width * 100;
                        var timeToGo = audioPlayer.current.duration * trackPercent / 100;
                        audioPlayer.current.currentTime = timeToGo;
                        road.classList.remove('w-100')
                        road.style.width = trackPercent + '%'
                        let transitionTime = Math.abs(Math.round((audioPlayer.current.currentTime - audioPlayer.current.duration * trackPercent / 100) * 10) / 10)
                        road.style.transition = `${transitionTime}s linear width`
                        if (!audioPlayer.current.paused) {
                            setTimeout(() => {
                                road.style.transition = `all ${Math.abs(Math.round((audioPlayer.current.currentTime - audioPlayer.current.duration) * 10) / 10)}s linear`
                                road.style.width = ''
                                road.classList.add('w-100')
                            }, 100);


                        }


                    }
                        break;

                    case 'track_fill': {
                        var _trackWidth = roadLn.getBoundingClientRect().x + roadLn.getBoundingClientRect().width;

                        var _trackPercent = 100 - (_trackWidth - trackPositionX) / roadLn.getBoundingClientRect().width * 100;

                        var _timeToGo = audioPlayer.current.duration * _trackPercent / 100;

                        audioPlayer.current.currentTime = _timeToGo;
                        // let trans = audioPlayer.current.duration - _timeToGo
                        // trans = Math.round(trans*10)/10
                        // road.style.width=_trackPercent+'%'
                        // road.style.transition = `${trans}s all linear`

                        audioPlayer.current.currentTime = _timeToGo;
                        road.classList.remove('w-100')
                        road.style.width = _trackPercent + '%'
                        let transitionTime = Math.abs(Math.round((audioPlayer.current.currentTime - audioPlayer.current.duration * _trackPercent / 100) * 10) / 10)
                        road.style.transition = `${transitionTime}s linear width`
                        if (!audioPlayer.current.paused) {
                            setTimeout(() => {
                                road.style.transition = `all ${Math.abs(Math.round((audioPlayer.current.currentTime - audioPlayer.current.duration) * 10) / 10)}s linear`
                                road.style.width = ''
                                road.classList.add('w-100')
                            }, 100);


                        }
                    }
                        break;

                    default:
                        break;
                }


            });

            audioPlayer.current.addEventListener('timeupdate', function (e: any) {
                var time = e.target.currentTime / e.target.duration * 100;
                if (currentTimeChange) {
                    currentTimeChange(e.target.currentTime)
                }
                if (audioTime) {
                    audioTime.innerHTML = Math.round(Number.parseFloat(e.target.currentTime) * 10) / 10;

                }

                // road.style.width = Math.round(time) + '%';
            });
        }
    }, []);

    useEffect(() => {
        if (currentTime && Math.ceil(currentTime) !== 0 && audioPlayer) {
            audioPlayer.current.currentTime = currentTime;
            audioPlayer.current.play()
        }
    }, [audioPlayer, currentTime])


    return (
        <>
            <div className={classNames({
                track__big: isBig,
                track__small: !isBig,
                track: true
            })} data-type="player" ref={contaniner}>
                <audio src={src} preload="metadata" data-id="audio" ref={audioPlayer}></audio>
                <div className="track__play track__item" data-type="btn"></div>
                {
                    isBig ? <div className="track__time track__item"><span data-type="time">0</span> / <span
                        data-type="duration">0</span></div> : ''
                }

                <div className="track__road track__item" data-type="track">
                    <div className="track__road__fill track__item" data-type="track_fill"></div>
                </div>
                <div className="track__item volume open">
                    <input type="range" name="volume" id="volume_range" min="0" max="100" step="5"
                           data-type="volume_range"/>
                    <div className="track__volume" data-type="volume"></div>
                </div>
                <a href={src} target="_blank" className="track__download track__item" download data-type="download"></a>
            </div>
            <a href={doc} download target={"_blank"}>Скачать .docx</a>
        </>
    )

}

export default Player;