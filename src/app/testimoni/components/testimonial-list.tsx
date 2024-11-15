"use client";

import { Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    text: "Exceptional service! The team went above and beyond my expectations.",
    date: "2024-03-20"
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 4,
    text: "Very professional and efficient. Would definitely recommend.",
    date: "2024-03-19"
  }
];

export function TestimonialList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="flex flex-col flex-1">
              <h3 className="font-semibold text-lg text-primary">{testimonial.name}</h3>
              <time className="text-sm text-black">
                {new Date(testimonial.date).toLocaleDateString()}
              </time>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < testimonial.rating
                      ? "text-primary fill-primary"
                      : "text-muted stroke-muted"
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-black">{testimonial.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}