import React, { useState } from "react";

const StarRating = ({ onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (value) => {
    if (!submitted) {
      setRating(value);
    }
  };

  const handleSubmit = () => {
    if (rating > 0) {
      onRatingSubmit(rating);
      setSubmitted(true);
    } else {
      alert("Please select a rating before submitting.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <svg
            key={value}
            className={`w-8 h-8 cursor-pointer ${
              rating >= value ? "text-yellow-400" : "text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick={() => handleStarClick(value)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95 4.146.018c.958.004 1.355 1.226.584 1.818l-3.36 2.455 1.287 3.951c.3.922-.756 1.688-1.541 1.125L10 13.011l-3.353 2.333c-.785.563-1.841-.203-1.541-1.125l1.287-3.951-3.36-2.455c-.77-.592-.374-1.814.584-1.818l4.146-.018 1.286-3.95z" />
          </svg>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Submit Rating
      </button>
      {submitted && (
        <div className="mt-4 text-green-600 text-lg font-bold">
          Thank you! You rated: {rating} star{rating > 1 ? "s" : ""}.
        </div>
      )}
    </div>
  );
};

export default StarRating;