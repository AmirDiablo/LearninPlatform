import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import TopNav from "./components/TopNav"
import Nav from "./components/Nav"
import Login from "./pages/Login"
import SignUp from "./pages/SiginUp"
import TeacherSignup from "./pages/TeacherSignup"
import TeacherLogin from "./pages/TeacherLogin"
import Roles from "./pages/Roles"
import Dashboard from "./pages/Dashboard"
import TeacherDashboard from "./pages/TeacherDashboard"
import TeacherCoursesPage from "./pages/TeacherCoursesPage"
import CreateCourse from "./pages/CreateCourse"
import EditCourse from "./pages/EditCourse"
import Courses from "./pages/Courses"
import CourseDetails from "./pages/CourseDetails"
import TeacherQuizPage from "./pages/TeacherQuizPage"
import { useUser } from "./context/userContext"
import CreateQuiz from "./pages/CreateQuiz"
import ProfileSetting from "./pages/ProfileSetting"
import TeacherPayment from "./pages/TeacherPayment"
import TeacherProfile from "./pages/TeacherProfile"
import StudentDashboard from "./pages/StudentDashboard"
import StudentCoursesPage from "./pages/StudentCoursePage"
import StudentQuizPage from "./pages/StudentQuizPage"
import StudentPayments from "./pages/StudentPayments"
import StudentProfileSetting from "./pages/StudentProfileSetting"
import QuizPage from "./pages/QuizPage"
import StudentQuizResult from "./pages/StudentQuizResult"
import QuizStatcis from "./pages/QuizStatics"
import BookLoader from "./components/BookLoader"

function App() {
  const {user} = useUser()

  return (
    <>
      <BrowserRouter>
        <TopNav />
        <Nav />
        <div className="layer z-10 bg-black/30 fixed top-0 bottom-0 left-0 right-0 hidden"></div>
        <div className="pages mt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="teacherSignup" element={<TeacherSignup />} />
            <Route path="teacherLogin" element={<TeacherLogin />} />
            <Route path="roles" element={<Roles />} />
            <Route path="studentdashboard" element={user ? <StudentDashboard /> : <Home />} />
            <Route path="teacherdashboard" element={user ? <TeacherDashboard /> : <Home />} />
            <Route path="teacherdashboard/teacherCoursesPage" element={user ? <TeacherCoursesPage /> : <Home />} />
            <Route path="teacherdashboard/teacherCoursesPage/createCourse" element={user ? <CreateCourse /> : <Home />} />
            <Route path="teacherdashboard/teacherCoursesPage/editCourse" element={user ? <EditCourse /> : <Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courseDetails" element={<CourseDetails />} />
            <Route path="teacherdashboard/teacherQuizPage" element={<TeacherQuizPage />} />
            <Route path="teacherdashboard/teacherQuizPage/createQuiz" element={<CreateQuiz />} />
            <Route path="teacherdashboard/profileSetting" element={<ProfileSetting />} />
            <Route path="teacherdashboard/teacherPayment" element={<TeacherPayment />} />
            <Route path="teacherProfile" element={<TeacherProfile />} />
            <Route path="studentdashboard/studentCoursesPage" element={<StudentCoursesPage />} />
            <Route path="studentdashboard/studentQuizPage" element={<StudentQuizPage />} />
            <Route path="studentdashboard/studentPayments" element={<StudentPayments />} />
            <Route path="studentdashboard/studentProfileSetting" element={<StudentProfileSetting />} />
            <Route path="studentdashboard/quizPage" element={<QuizPage />} />
            <Route path="studentdashboard/studentQuizPage/studentQuizResult" element={<StudentQuizResult />} />
            <Route path="teacherdashboard/teacherQuizPage/quizStatics" element={<QuizStatcis />} />
            <Route path="bookLoader" element={<BookLoader />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
