"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function OurJourney() {
  // Animation state
  const [scrollPosition, setScrollPosition] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineHeight, setTimelineHeight] = useState(0);
  const [timelineTop, setTimelineTop] = useState(0);
  const [arrowPosition, setArrowPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Milestones data
  const milestones = [
    {
      date: "Feb 2024", // Changed from "February 2024"
      title: "Company Founded",
      description:
        "Started with a clear mission: to bridge the gap between academic learning and industry demands by empowering students with practical skills and career support.",
    },
    {
      date: "June 2024",
      title: "First Training Batch Launched",
      description:
        "Officially kicked off the first offline and online training batch focused on Full-Stack Web Development, AI/ML foundations, and Placement Preparation.",
    },
    {
      date: "October 2024",
      title: "Expanded to 5 Colleges",
      description:
        "Within a few months, partnered with 5 engineering colleges in Hyderabad for technical workshops, career sessions, and placement-oriented training programs.",
    },
    {
      date: "March 2025",
      title: "Crossed 120+ College Partnerships & 17,000+ Students Trained",
      description:
        "Grew from a single classroom initiative to training 17,000+ students (offline and online) across 120+ engineering colleges through regular workshops, training batches, hackathons, and placement drives with 13,600+ students successfully placed.",
    },
    {
      date: "June 2025",
      title: "Scaling New Heights",
      description:
        "Continuing to expand into more colleges, increasing student outreach, launching internship opportunities, and building placement-ready career services for students across India.",
    }
  ];

  // Initialize measurements and set up scroll listener
  useEffect(() => {
    const updateMeasurements = () => {
      if (!timelineRef.current) return;
      
      const timeline = timelineRef.current;
      const timelineRect = timeline.getBoundingClientRect();
      setTimelineHeight(timeline.offsetHeight);
      setTimelineTop(timelineRect.top + window.scrollY);
    };
    
    // Initial measurement
    updateMeasurements();
    
    // Handle scroll and update arrow position
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      updateMeasurements();
    };
    
    // Handle window resize
    const handleResize = () => {
      updateMeasurements();
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculate arrow position based on scroll
  useEffect(() => {
    if (timelineHeight === 0) return;
    
    const viewportHeight = window.innerHeight;
    const timelineBottom = timelineTop + timelineHeight;
    
    // Check if timeline is visible
    const isTimelineVisible = 
      (timelineTop < window.scrollY + viewportHeight) && 
      (timelineBottom > window.scrollY);
    
    setIsVisible(isTimelineVisible);
    
    if (isTimelineVisible) {
      // Calculate scroll progress relative to the timeline
      const scrollStart = timelineTop - viewportHeight;
      const scrollEnd = timelineBottom;
      const scrollRange = scrollEnd - scrollStart;
      
      // Calculate progress percentage (0 to 1)
      const scrollProgress = Math.max(0, Math.min(1, (scrollPosition - scrollStart) / scrollRange));
      
      // Set arrow position
      setArrowPosition(scrollProgress * timelineHeight);
    }
  }, [scrollPosition, timelineHeight, timelineTop]);

  return (
    <section id="our-journey" className="pt-24 pb-0 bg-white overflow-hidden relative">
      {/* Large decorative circles like other components */}
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
      <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-indigo-100 rounded-full opacity-50"></div>
      <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-purple-100 rounded-full opacity-30"></div>
      <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-yellow-100 rounded-full opacity-40"></div>
      
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-base font-semibold tracking-wider text-blue-600 uppercase mb-4">
            Timeline
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Journey
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-700">
            From our founding to where we are today, every milestone has been guided by our commitment to empowering careers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Journey timeline */}
          <div className="relative" ref={timelineRef}>
            {/* Animated arrow */}
            <div 
              className={`absolute left-0 md:left-1/2 z-30 transform -translate-x-1/2 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                top: `${arrowPosition}px`,
                transition: 'top 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            
            {/* Enhanced vertical line with gradient */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-600 opacity-60"></div>
            
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative z-10">
                  <div className={`flex flex-col md:flex-row items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Enhanced year bubble with gradient and animation */}
                    <div className="absolute top-0 left-0 md:left-1/2 transform -translate-y-1/2 md:-translate-x-1/2 flex items-center justify-center z-20">
                      <div className="relative">
                        {/* Outer glowing ring */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 animate-ping"></div>
                        <div className="relative px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 border-4 border-white shadow-xl">
                          <span className="text-sm font-bold text-white">{milestone.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced content box */}
                    <div className={`mt-12 md:mt-0 ml-16 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                      <div className="relative group">
                        {/* Decorative elements around content */}
                        <div className={`absolute -top-4 ${index % 2 === 0 ? '-right-4' : '-left-4'} w-16 h-16 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                        <div className={`absolute -bottom-4 ${index % 2 === 0 ? '-left-4' : '-right-4'} w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>
                        
                        <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1 overflow-hidden">
                          {/* Top gradient line */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                          
                          <div className="relative z-10">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                            <p className="text-gray-700 leading-relaxed">{milestone.description}</p>
                          </div>
                          
                          {/* Background pattern */}
                          <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <circle cx="50" cy="50" r="40" fill="currentColor" className="text-blue-600"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Future section with more visual effects */}
      <div className="mt-20 w-full relative overflow-hidden mb-0 border-b-0">
        {/* Background decorative elements */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/5 rounded-full"></div>
        
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 py-16 px-4 text-white text-center shadow-2xl">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-4xl font-bold mb-6">Join Our Journey</h3>
              <p className="text-white/90 mb-8 max-w-3xl mx-auto text-xl leading-relaxed">
                As we look to the future, we remain committed to innovation and excellence in education. 
                Our vision is to become the leading platform that connects learning with career success, 
                empowering millions to achieve their professional goals.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pb-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <Link href="/careers" className="relative inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  View Open Positions
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <a href="mailto:contact@nirudhyog.com" className="relative inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:scale-105">
                  Contact Us
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
