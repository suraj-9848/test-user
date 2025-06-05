import { testimonials } from "../../sample_data";
import TestimonialCard from "./TestimonialCard";

const Testimonials = () => {
  return (
    <section className="bg-[#f8fafc] py-16 px-4 md:px-10">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold">
          What Our <span className="text-orange-500">Students Say</span>
        </h2>
        <div className="mt-6 space-y-4 text-gray-600 text-md leading-relaxed max-w-3xl mx-auto">
          <p>
            Hear from students who have transformed their learning experience using our LMS. Whether it&rsquo;s mastering a new subject, earning certifications, or preparing for a career, our platform has supported thousands on their educational journeys.
          </p>
          <p>
            These testimonials reflect real feedback from learners across various disciplines &mdash; highlighting how intuitive navigation, interactive content, and instructor support helped them succeed.
          </p>
          <p>
            Your success story could be next. Browse the testimonials below to see how our LMS is making a difference.
          </p>
          <div className="pt-2">
            <a
              href="mailto:contact@nirudhrog.com"
              className="inline-block text-black underline hover:text-blue-600 transition-colors text-lg font-medium"
            >
              📧 Share your experience
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {testimonials.map((t, index) => (
          <TestimonialCard key={index} {...t} />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
