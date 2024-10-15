const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
  },
  places_visited: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
  ],
  duration: {
    number: { type: Number, required: true },
    period: { type: String, required: true },
  },
  highlights: [String],
  inclusives: [String],
  exclusives: [String],
  images: [{ type: String }],
  dates: [Date],
  description: { type: String },
  catch_phrase: { type: String },
  itinerary: [
    {
      title: String,
      points: [String],
    },
  ],
  categories: [String],
  blog_contents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  price: { type: Number, required: true },
  rating: { type: Number, default: 1 },
});

const NewTrip = mongoose.model("NewTrip", tripSchema);
module.exports = NewTrip;
