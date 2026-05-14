'use client';

import { useState, useEffect } from 'react';
import { Star, Copy, ExternalLink, Sparkles, Check, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import reviewsData from '@/data/reviews.json';

type ReviewsType = {
  [key: string]: string[];
};

const reviews: ReviewsType = reviewsData;

export default function ReviewPage() {
  const [rating, setRating] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleRatingSelect = (val: number) => {
    setRating(val);
    // Auto-select first suggested review
    const suggested = reviews[val.toString()];
    if (suggested && suggested.length > 0) {
      setSelectedReview(suggested[0]);
    }
  };

  const handleAiGenerate = async () => {
    if (!rating) return;

    setIsGenerating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });

      const data = await response.json();
      if (data.review) {
        setSelectedReview(data.review);
      }
    } catch (error) {
      console.error('Failed to generate AI review:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAndPost = async () => {
    if (!selectedReview || !rating) return;

    try {
      await navigator.clipboard.writeText(selectedReview);
      setIsCopied(true);
      
      // Use the standard working Google Review URL
      const reviewUrl = `https://search.google.com/local/writereview?placeid=ChIJeWPseN8ZjjkRPvRjXlF6AvQ`;

      setTimeout(() => {
        setIsCopied(false);
        window.open(reviewUrl, '_blank');
      }, 800);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback redirect if copy fails
      window.open(process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL, '_blank');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-6 pb-12 font-sans text-slate-900">
      {/* Header */}
      <header className="w-full max-w-md flex flex-col items-center mb-8 mt-4">
        <div className="relative w-48 h-20 mb-2">
          <img 
            src="/assets/logo.png" 
            alt="Chaurasiya Mobile Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback if logo is missing
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Sakaldiha, Chandauli</p>
      </header>

      <div className="w-full max-w-md flex-1">
        <AnimatePresence mode="wait">
          {!rating ? (
            /* SCREEN 1: Rating */
            <motion.div
              key="rating-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-6"
            >
              <h2 className="text-xl font-semibold">How was your experience?</h2>
              <p className="text-slate-500 text-sm">Your feedback helps us serve you better.</p>
              
              <div className="flex justify-between w-full px-2 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingSelect(star)}
                    className="group"
                  >
                    <Star
                      size={40}
                      className={`${
                        rating && rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'
                      } group-active:scale-125 transition-transform`}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* SCREEN 2: Selection & AI */
            <motion.div
              key="selection-screen"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col space-y-6"
            >
              <button 
                onClick={() => {setRating(null); setSelectedReview('');}}
                className="flex items-center text-slate-500 text-sm font-medium hover:text-blue-600 transition-colors"
              >
                <ChevronLeft size={18} />
                Back to rating
              </button>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Select a review</h2>
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    <Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-bold text-yellow-700">{rating}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {reviews[rating.toString()]?.map((tmpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedReview(tmpl)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        selectedReview === tmpl 
                        ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm ring-1 ring-blue-500' 
                        : 'border-slate-100 hover:border-blue-200 bg-slate-50/30'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{tmpl}</p>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-slate-400">OR</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border bg-slate-900 text-white min-h-[100px] flex items-center justify-center relative overflow-hidden`}>
                    {isGenerating ? (
                      <div className="flex flex-col items-center space-y-2">
                        <Loader2 className="animate-spin" size={24} />
                        <span className="text-xs text-slate-400">AI is writing...</span>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed text-center italic">
                        "{selectedReview || "Generate or select a review above"}"
                      </p>
                    )}
                    <Sparkles className="absolute -top-1 -right-1 text-slate-800" size={60} />
                  </div>

                  <button
                    onClick={handleAiGenerate}
                    disabled={isGenerating}
                    className="w-full py-3 rounded-2xl border border-slate-200 flex items-center justify-center space-x-2 text-sm font-semibold disabled:opacity-50 transition-colors hover:bg-slate-50"
                  >
                    <Sparkles size={18} className="text-blue-500" />
                    <span>Generate AI Review</span>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="sticky bottom-6 pt-2">
                <button
                  onClick={handleCopyAndPost}
                  disabled={!selectedReview}
                  className={`w-full py-5 rounded-2xl shadow-lg flex items-center justify-center space-x-3 font-bold text-lg active:scale-95 transition-all ${
                    isCopied ? 'bg-green-500 shadow-green-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
                  } text-white`}
                >
                  {isCopied ? (
                    <>
                      <Check size={24} />
                      <span>Review Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={24} />
                      <span>Copy & Open Google</span>
                      <ExternalLink size={18} className="opacity-70" />
                    </>
                  )}
                </button>
                <div className="text-center mt-4 space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    One-Tap Review
                  </p>
                  <p className="text-xs text-slate-500">
                    The review is in your clipboard. Just <span className="font-bold text-blue-600 italic underline">Paste</span> it on Google!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-auto pt-10 text-slate-400 text-[10px] text-center">
        &copy; {new Date().getFullYear()} Chaurasiya Mobile. All rights reserved.
      </footer>
    </main>
  );
}
