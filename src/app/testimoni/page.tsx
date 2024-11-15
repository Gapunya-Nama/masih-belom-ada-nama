import { TestimonialList } from './components/testimonial-list';
import { TestimonialForm } from './components/testimonial-form';

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
            Client Testimonials
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-black sm:mt-4">
            Read what our clients say about their experience with our services
          </p>
        </div>
        <TestimonialList />
        <TestimonialForm />
      </div>
    </main>
  );
}