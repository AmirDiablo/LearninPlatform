import internet from "../assets/internet3.jpeg"
import { FiSearch } from "react-icons/fi";
import idea from "../assets/idea.jpeg"
import cup from "../assets/cup.jpeg"
import conversation from "../assets/conversation.jpeg"
import document from "../assets/document.png"
import target from "../assets/target.png"
import keyboard from "../assets/keyboard.png"
import rocket from "../assets/rocket.png"
import orangeStar from "../assets/orangeStar.png"
import purpleStar from "../assets/purpleStar.png"
import world from "../assets/design.png"
import { FaArrowRightLong } from "react-icons/fa6";

const Home = () => {
    return ( 
        <div>

            <div className="flex flex-col md:flex-row md:items-center">
                <img src={internet} className="mx-auto w-[90%] md:w-[45%] md:order-2" />
                <div className="space-y-5 mx-5 md:w-[50%] md:mx-20">
                    <p className="text-orange-500 font-[600] text-[12px] -mb-[3px]">INDRODUCING INTERACTIVE</p>
                    <p className="text-4xl font-[600] md:text-[5vw]">Learning courses by top teachers.</p>
                    <p className="text-black/70 font-[600] text-[13px]">Choose from over 4000 courses on topics like cartoon design, graphic design and mush more</p>
                    <div className="relative">
                        <input type="text" placeholder="Search course, subject, name" className="p-4 w-[100%] rounded-full bg-white text-[14px]" />
                        <div className="absolute top-[50%] -translate-y-[50%] right-3 bg-orange-500 text-white p-2 text-2xl w-max rounded-full"><FiSearch /></div>
                    </div>
                </div>
            </div>
            

            <div className="mx-5 columns-2 md:columns-4 mt-20 md:mx-20">

                <div className="mt-4">
                    <p className="text-3xl font-[400] w-[20%]">Our Program</p>
                    <p className="text-black/70 text-[14px]">We offer a variety of courses over various creative topics</p>
                </div>

                <div className="">
                    <img src={idea} className="w-20" />
                    <p className="font-[500]">Creative Thinking</p>
                    <p className="text-black/70 text-[14px]">Add wings to your ideas and fly as a thinker</p>
                </div>

                <div className="">
                    <img src={cup} className="w-20" />
                    <p className="font-[500]">Career planning</p>
                    <p className="text-black/70 text-[14px]">Learn how to shape your career with sessions!</p>
                </div>

                <div className="">
                    <img src={conversation} className="w-20" />
                    <p className="font-[500]">Public Speaking</p>
                    <p className="text-black/70 text-[14px]">Remove the fear of speaking & polish your skills!</p>
                </div>

            </div>

            <img className="absolute right-5 translate-y-[15px]" src={orangeStar} />
            <img className="absolute right-20 translate-y-[60px]" src={purpleStar} />

            <div className="mx-5 mt-20 md:mx-20">

                <p className="text-[#FF8643] font-[500]">100% FREE</p>
                <p className="text-3xl font-[500]">Start learning with free courses </p>
                <p className="text-black/70 text-[14px] mt-4">Even if you are not ready with paid courses, there are a variety of free courses available for you </p>
                
                <div className="columns-2 md:columns-4 mt-10 *:justify-self-center space-y-5">
                    <div>
                        <img src={document} />
                        <p className="font-[700]">UI UX Desgin Course</p>
                        <p className="text-[14px] text-black/70">Brush up your fundamentals of designing</p>
                    </div>

                    <div>
                        <img src={target} />
                        <p className="font-[700]">Management Course</p>
                        <p className="text-[14px] text-black/70">Learn different types of management skills.</p>
                    </div>

                    <div>
                        <img src={keyboard} />
                        <p className="font-[700]">Rapid Typing Course</p>
                        <p className="text-[14px] text-black/70">Helps you improve your typing speed and reduce typos.</p>
                    </div>

                    <div className="">
                        <img src={rocket} />
                        <p className="font-[700]">SEO & Marketing Course</p>
                        <p className="text-[14px] text-black/70">Learn the basics of search engine optimization</p>
                    </div>
                
                </div>

            </div>


            <div className="text-center mt-20 mx-5 md:mx-20 mb-10">

                <p className="text-[#FF8643] font-[600]">BUILD UP THE COMMUNITY</p>
                <p className="text-3xl font-[500]">Join the biggest community of learning</p>
                <p className="text-black/70 text-[14px] mt-5">Learn, share the knowledge with community members & shine from wherever you're through online learning web app</p>
                <img src={world} className="mt-5 rounded-[10px] mx-auto" />
 
                <div className="mx-5 mt-5 bg-purple-900 relative text-white overflow-hidden flex px-5 text-start py-7 rounded-full items-center justify-center md:mx-20 md:py-[5vw]">
                    <img src={orangeStar} className="absolute top-5 left-5 w-7" />
                    <div className="rounded-full bg-orange-500 aspect-square w-[15vw] absolute right-0 -top-7 "></div>
                    <p className="w-[50%] text-[2vw]">Join now get the class certificate</p>
                    <div className="relative h-max">
                        <input type="text" placeholder="Your email address" className="p-2 w-[100%] text-black rounded-full bg-white text-[12px] md:w-[20vw] md:p-[2vw]" />
                        <div className="absolute top-[50%] -translate-y-[50%] right-1 bg-orange-500 text-white p-2 w-max rounded-full"><FaArrowRightLong /></div>
                    </div>
                </div>

            </div>
        </div>
     );
}
 
export default Home;