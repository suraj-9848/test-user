import AlumniSection from '@/components/AlumniSection'
import FAQ from '@/components/FaQSection'
import HeroSection from '@/components/Hero'
import Testimonials from '@/components/Testimonials'
import React from 'react'

const page = () => {
  return (
    <div>
      <HeroSection/>
      <Testimonials/>
      <AlumniSection/>
      <FAQ/>
    </div>
  )
}

export default page
