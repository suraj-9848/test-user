import React from 'react'

const SkillQuizSection = () => (
  <section className="p-4 sm:p-6 md:p-10 bg-white">
    <div className="container mx-auto">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-8 text-center">Find Your Skill Level</h2>
      <div className="max-w-xl sm:max-w-2xl mx-auto p-4 sm:p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 quiz-card">
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 text-center">
          Take a quick quiz to assess your skills and get personalized course recommendations tailored to your learning goals.
        </p>
        <div className="flex justify-center">
          <button className="bg-blue-600 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-lg font-semibold hover:bg-blue-700 transition duration-150 text-sm sm:text-base">
            Start Skill Quiz
          </button>
        </div>
      </div>
    </div>
  </section>
)

export default SkillQuizSection