import React, { useState } from "react";

export default function CourseOutlineForm({courseId}) {
  const [chapters, setChapters] = useState([
    { title: "", lessons: [{ title: "", file: null }] },
  ]);
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChapterTitleChange = (index, value) => {
    const newChapters = [...chapters];
    newChapters[index].title = value;
    setChapters(newChapters);
  };

  const handleLessonTitleChange = (chapterIndex, lessonIndex, value) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].lessons[lessonIndex].title = value;
    setChapters(newChapters);
  };

  const handleLessonFileChange = (chapterIndex, lessonIndex, file) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].lessons[lessonIndex].file = file;
    setChapters(newChapters);
  };

  const addChapter = () => {
    setChapters([...chapters, { title: "", lessons: [{ title: "", file: null }] }]);
  };

  const addLesson = (chapterIndex) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].lessons.push({ title: "", file: null });
    setChapters(newChapters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    chapters.forEach((chapter, chapterIndex) => {
      formData.append(`chapters[${chapterIndex}][title]`, chapter.title);
      formData.append('courseId', courseId)
      chapter.lessons.forEach((lesson, lessonIndex) => {
        formData.append(
          `chapters[${chapterIndex}][lessons][${lessonIndex}][title]`,
          lesson.title
        );
        if (lesson.file) {
          formData.append(
            `chapters[${chapterIndex}][lessons][${lessonIndex}][file]`,
            lesson.file
          );
        }
      });
    });

    console.log(chapters)

    try {
      const response = await fetch("http://localhost:3000/api/course/createLessons", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("خطا در ارسال اطلاعات");
      }

      const data = await response.json();
      alert("اطلاعات با موفقیت ارسال شد");
      console.log(data);
    } catch (error) {
      alert("ارسال اطلاعات با خطا مواجه شد: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "auto" }} className="flex gap-5 flex-col mx-5">
      <strong className="block mx-5">create Lessons</strong>
      {chapters.map((chapter, chapterIndex) => (
        <div
          key={chapterIndex}
          className="courseForm flex flex-col gap-5 mx-5"
        >
          <label>
            <input
              type="text"
              value={chapter.title}
              onChange={(e) => handleChapterTitleChange(chapterIndex, e.target.value)}
              style={{ width: "100%", marginTop: 5, marginBottom: 10 }}
              className="bg-white rounded-[7px] p-5"
              placeholder="Curriculum title"
              required
            />
          </label>

          <div>
            {chapter.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="flex mb-5">
                <label className="w-[100%]">
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) =>
                      handleLessonTitleChange(chapterIndex, lessonIndex, e.target.value)
                    }
                    placeholder="Lesson title"
                    required
                    className="bg-white rounded-[7px] w-[100%] p-5"
                  />
                </label>
                <label className="relative flex justify-center items-center text-2xl bg-orange-500 text-white px-5 py-2 rounded-[7px] w-max ">
                  <input
                    type="file"
                    className="w-[100%] absolute h-[100%] top-0 left-0 opacity-0 lessons"
                    onChange={(e) =>
                      handleLessonFileChange(chapterIndex, lessonIndex, e.target.files[0])
                    }
                    style={{ display: "block", marginTop: 5 }}
                    
                    required
                  />
                  📂
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addLesson(chapterIndex)}
              style={{ marginTop: 10 }}
              className="bg-orange-500 text-white rounded-[7px] px-5 py-2 w-max hover:cursor-pointer"
            >
              Add Lesson
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mx-5">
        <button type="button" onClick={addChapter} className="bg-orange-500 text-white rounded-[7px] px-5 py-2 w-max hover:cursor-pointer">
          Add Curriculum
        </button>
        <button type="submit" className="bg-orange-500 text-white rounded-[7px] px-5 py-2">Upload</button>
      </div>

      <br />
      
    </form>
  );
}