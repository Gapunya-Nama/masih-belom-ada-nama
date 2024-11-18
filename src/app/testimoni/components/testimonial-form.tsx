"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export function TestimonialForm() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <Card className="mt-16 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Share Your Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-black">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-black">Rating</Label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <button
                  aria-label="send info"
                  key={index}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoveredRating(index + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(index + 1)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      index < (hoveredRating || rating)
                        ? "text-primary fill-primary"
                        : "text-muted stroke-muted"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-black">Your Testimonial</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience with our service"
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Testimonial
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}