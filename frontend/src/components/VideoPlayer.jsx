import { useState, useRef, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { HiOutlineSpeakerXMark } from "react-icons/hi2";
import { useUser } from "../context/userContext";


const VideoPlayer = ({videoURL, videoTitle, lessonId, curriculumId, courseId}) => {
    const {user} = useUser()
    const [isPlaying, setIsPlaying] = useState(false);
    const [counted, setCounted] = useState(false)
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [currentVideo, setCurrentVideo] = useState({src: videoURL, title: videoTitle}); //videoItems[0]
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(()=> {
        setCurrentVideo({src: videoURL, title: videoTitle})
        setIsPlaying(false)
        setCurrentTime(0)
        videoRef.current.currentTime = 0
    }, [videoURL])

    // به روز رسانی زمان ویدیو
    useEffect(() => {
        const video = videoRef.current;
        
        const updateTime = () => {
            setCurrentTime(video.currentTime);
            setDuration(video.duration || 0);
            
            // به روز رسانی پیشرفت
            if (progressRef.current) {
                const percent = (video.currentTime / video.duration) * 100;
                progressRef.current.style.width = `${percent}%`;
            }
        };
                
        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', () => {
            setDuration(video.duration || 0);
        });
        
        return () => {
            video.removeEventListener('timeupdate', updateTime);
        };
    }, [currentVideo]);

    const attendance = async ()=> {
        const response = await fetch("http://localhost:3000/api/enrollment/attendance", {
            method: "PATCH",
            body: JSON.stringify({courseId, curriculumId, lessonId}),
            headers: {
                "Authorization" : `Bearer ${user.token}`,
                "Content-Type" : "application/json"
            }
        })
        const json = await response.json()

        if(response.ok) {
            console.log("attendance submitted")
        }

        if(!response.ok) {
            console.log('attendance failed')
        }
    }

    useEffect(()=> {
        console.log(courseId)
        if(courseId) {
            const percent = currentTime * 100 / duration
            if(percent >= 70 && counted == false) {
                attendance()
                setCounted(true)
            }
        }
    },[currentTime, courseId])

    // کنترل پخش و توقف
    const togglePlay = () => {
        const video = videoRef.current;
        
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    // کنترل صدا
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
    };

    // کنترل پیشرفت ویدیو
    const handleProgressClick = (e) => {
        const progressBar = e.currentTarget;
        const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
        const width = progressBar.clientWidth;
        const percent = clickPosition / width;
        
        videoRef.current.currentTime = percent * duration;
    };

    // تغییر سرعت پخش
    const changePlaybackRate = () => {
        const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
        const currentIndex = rates.indexOf(playbackRate);
        const nextIndex = (currentIndex + 1) % rates.length;
        const newRate = rates[nextIndex];
        
        setPlaybackRate(newRate);
        videoRef.current.playbackRate = newRate;
    };

    // تغییر ویدیو
    const changeVideo = (video) => {
        setCurrentVideo(video);
        setIsPlaying(false);
        setCurrentTime(0);
        
        // پس از تغییر ویدیو، آن را پخش کنید
        setTimeout(() => {
            videoRef.current.play();
            setIsPlaying(true);
        }, 300);
    };

    // فرمت زمان به دقیقه:ثانیه
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const toggleMute = ()=> {
        const video = videoRef.current
        video.muted = !video.muted
        setIsMuted(video.muted)
    }

    useEffect(()=> {
        document.querySelector(".player-container").addEventListener("mouseenter", ()=> {
            document.querySelector(".controlls").style.opacity = "1"
            document.querySelector(".playBtn").style.opacity = "1"
        })

        document.querySelector(".player-container").addEventListener("mouseleave", ()=> {
            document.querySelector(".controlls").style.opacity = "0"
            document.querySelector(".playBtn").style.opacity = "0"
        })
    }, [])

    return ( 
        <div>
                    
            <div on={()=> setIsHovered(true)} className="player-container  mx-auto">
                <div className=" relative">
                    <video className="rounded-[10px]"
                        ref={videoRef}
                        src={'http://localhost:3000/uploads/lessons/'+currentVideo.src}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                    />

                    <button className="playBtn opacity-0 text-white/90 rounded-full text-3xl absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]" onClick={togglePlay}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>

                    <div className="opacity-0 transition-all duration-300 controlls absolute z-20 w-[100%] flex items-center bottom-0 gap-2 p-1">
                        {isMuted ? <span onClick={toggleMute} className="text-white text-2xl"><HiOutlineSpeakerXMark /></span>: <span onClick={toggleMute} className="text-white text-2xl"><HiOutlineSpeakerWave /></span>}
                        <div className="progress-container" onClick={handleProgressClick}>
                            <div ref={progressRef} className="progress-bar"></div>
                        </div>
                        <div className="time-display absolute -top-3 left-10">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                        <button className="bg-orange-500 rounded-full aspect-square w-7 h-7 p-3 flex justify-center items-center" onClick={changePlaybackRate}>
                            {playbackRate}x
                        </button>
                    </div>

                </div>
                
                <div className="mt-2">
                    <h2>{currentVideo.title}</h2>
                    <p>{currentVideo.description}</p>
                </div>
            
            </div>
                    
        </div>
    );
}
 
export default VideoPlayer;