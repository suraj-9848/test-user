import React from 'react'

const CourseHighlight = () => (
  <div className="w-full lg:w-1/2 lg:pl-6 bg-yellow-50 p-4 sm:p-6 rounded-xl shadow-lg mt-4 lg:mt-0">
    <img
      alt="People collaborating on graphic design"
      className="w-full h-40 sm:h-64 object-cover rounded-lg mb-4 sm:mb-6"
      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2Z29QBewAm54A_DPV8wAOkKr8xOJNiidw5szsIN6MD8pMvWQQwddHuY0XnSdaS7KY2pxodYY857XTQSEuXEbREUOvvgdfgA3k53UdsBIhD7QEhULfOWR_kL-wFa0BjFMYWlHB-aw1dUHgb5ijB7ip9Q0ufrw8Z4zcqJtnpSb6i2HS7Xm3ujApQ40neHn0qHVj4QguPksPsvKuuty-RB4rH8nfu8gn3hsBNqrq6mbeucNYODsJec6WwIOhfyIb9mABz2RGNEjpxMVD"
    />
    <div className="flex items-center mb-2">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="material-icons text-yellow-500 text-base sm:text-lg">star</span>
      ))}
      <span className="ml-2 text-xs sm:text-sm text-gray-600">5.0</span>
      <span className="ml-1 text-xs sm:text-sm text-gray-500">12,246 ratings</span>
    </div>
    <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">Graphic Design Specialization</h2>
    <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
      Make Compelling Design. Learn and apply the principles of graphic design towards a comprehensive branding project.
    </p>
    <button className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-150 mb-2 text-sm sm:text-base">
      Enroll for Free
    </button>
    <p className="text-xs text-gray-500 text-center mb-4 sm:mb-6">
      Enroll to start your 7-day full access free trial <br /> Starts Dec 16, 2019
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex items-start space-x-2 sm:space-x-3">
        <span className="material-icons text-blue-600 mt-1">school</span>
        <div>
          <h4 className="font-semibold text-gray-700 text-sm">100% Online Courses</h4>
          <p className="text-xs text-gray-500">Start now & learn at your own schedule</p>
        </div>
      </div>
      <div className="flex items-start space-x-2 sm:space-x-3">
        <span className="material-icons text-blue-600 mt-1">schedule</span>
        <div>
          <h4 className="font-semibold text-gray-700 text-sm">6 Months to Complete</h4>
          <p className="text-xs text-gray-500">Suggested 4 hours/week</p>
        </div>
      </div>
      <div className="flex items-start space-x-2 sm:space-x-3">
        <span className="material-icons text-blue-600 mt-1">event_available</span>
        <div>
          <h4 className="font-semibold text-gray-700 text-sm">Flexible Schedule</h4>
          <p className="text-xs text-gray-500">Set and maintain flexible deadlines</p>
        </div>
      </div>
      <div className="flex items-start space-x-2 sm:space-x-3">
        <span className="material-icons text-blue-600 mt-1">translate</span>
        <div>
          <h4 className="font-semibold text-gray-700 text-sm">English</h4>
          <p className="text-xs text-gray-500">Subtitles: English and Spanish</p>
        </div>
      </div>
    </div>
    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
      Graphic design is all around us, in a myriad of forms, both on screen and in print, yet it is always made up of images and words to create ...
    </p>
  </div>
)

export default CourseHighlight