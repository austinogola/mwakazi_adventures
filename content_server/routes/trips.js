const express = require("express");
const Trip = require("../models/Trip");
const Activity = require("../models/Activity");
const NewTrip = require("../models/NewTrip");
const Destination = require("../models/Destination");
const { verifyToken, isAdmin } = require("../middleware/auth"); // Authentication middleware
const router = express.Router();
const mongoose = require("mongoose");

// router.get("/", async (req, res) => {
//   try {
//     console.log(req.query);
//     let {
//       activities,
//       title,
//       places_visited,
//       destination,
//       locations_visited,
//       duration,
//       inclusives,
//       dates,
//       description,
//       categories,
//       price,
//       rating,
//       sort,
//       size,
//     } = req.query;

//     if (sort) {
//       sort = JSON.parse(sort);
//     } else {
//       sort = {};
//     }

//     let limit = size || 10;

//     // const trips=await Trip.find({ images: { $ne: [] } }).limit(limit)
//     const trips = await NewTrip.find({
//       catch_phrase: { $exists: true, $ne: "" },
//     })
//       .sort({ rating: -1, "images.length": -1 })
//       .limit(limit);

//     let tripsArr = [];
//     for (const trip of trips) {
//       const theDest = await Destination.findById(trip.destination);
//       let activities_arr = [];
//       // for(const activityId of trip._doc.activities){
//       //   const theAct= await Activity.findById(activityId)
//       //   activities_arr.push(theAct)
//       // }
//       tripsArr.push({ ...trip._doc, destination: theDest });
//       // console.log(tripsArr.length)
//     }

//     // console.log(tripsArr)

//     // const trips = await Trip.find().populate('location').populate('activities');
//     res.status(200).json({ trips: tripsArr, status: "success" });
//   } catch (error) {
//     console.log(error.message);
//     res
//       .status(500)
//       .json({ message: "Error fetching trips", status: "fail", error });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const tripsArr = await Trip.find();
    res.status(200).json({ status: "success", trips: tripsArr });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: "Error fetching trips" });
  }
});

router.get("/destinations", async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ message: "Error fetching destinations" });
  }
});

// Get a specific trip by ID
router.get("/:id", async (req, res) => {
  const tripId = req.params.id;
  console.log("get request reached:", tripId);
  try {
    const trip = await Trip.findById(tripId);
    console.log(trip);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    let activities = [];
    // for(const actId of trip.activities){
    //   let theAct= await Activity.findById(actId)
    //   activities.push(theAct)
    // }

    // trip.activities=activities

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trip", error });
  }
});

// Create a new trip (Admin only)
router.post("/addNewTrip", async (req, res) => {
  try {
    const {
      title,
      destination: { country, continent, locale },
      duration,
      inclusives,
      exclusives,
      images,
      dates,
      description,
      catch_phrase,
      itinerary,
      categories,
      blog_contents,
      activities,
      price,
      rating,
      places_visited,
      highlights,
    } = req.body;

    if (
      !title ||
      !country ||
      !continent ||
      !locale ||
      !duration ||
      !dates ||
      !price
    ) {
      return res
        .status(400)
        .json({ message: "Error creating trip. Missing required details" });
    }

    const destId = await Destination.findOneAndUpdate(
      { country, continent, locale },
      { country, continent, locale },
      { new: true, upsert: true }
    );

    const placesIds =
      places_visited && places_visited.length > 0
        ? await Promise.all(
            places_visited.map(async (place) => {
              const { country, continent, locale } = place;
              const visitedPlace = await Destination.findOneAndUpdate(
                { country, continent, locale },
                { country, continent, locale },
                { new: true, upsert: true }
              );
              console.log("Visited Place:", visitedPlace);
              return visitedPlace._id;
            })
          )
        : [];

    const activityIds =
      activities && activities.length > 0
        ? await Promise.all(
            activities.map(async (activityName) => {
              const activity = await Activity.findOneAndUpdate(
                { name: activityName },
                { name: activityName },
                { new: true, upsert: true }
              );
              return activity._id;
            })
          )
        : [];

    // Create new trip
    const newTrip = new Trip({
      activities: activityIds,
      destination: destId,
      title,
      duration,
      inclusives,
      exclusives,
      dates,
      description,
      blog_contents,
      categories,
      price,
      rating,
      images,
      catch_phrase,
      itinerary,
      places_visited: placesIds,
      highlights,
    });

    await newTrip.save();

    res.status(201).json({ trip: newTrip, message: "Trip added successfully" });
  } catch (error) {
    console.error("Error creating trip:", error);
    res
      .status(500)
      .json({ message: "Error creating trip", error: error.message });
  }
});

router.post("/addDestination", async (req, res) => {
  try {
    const { country, continent, locale } = req.body;

    if (!country || !continent || !locale) {
      return res
        .status(400)
        .json({ message: "Missing required destination details" });
    }

    const existingDestination = await Destination.findOne({
      country,
      continent,
      locale,
    });

    if (existingDestination) {
      return res.status(400).json({
        message: "Destination already exists",
        destination: existingDestination,
      });
    }

    const newDestination = new Destination({
      country,
      continent,
      locale,
    });

    await newDestination.save();

    res.status(201).json({
      message: "Destination created successfully",
      destination: newDestination,
    });
  } catch (error) {
    console.error("Error creating destination:", error);
    res
      .status(500)
      .json({ message: "Error creating destination", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  console.log("PATCH API reached");
  console.log("PATCH request received for ID:", req.params.id);
  console.log("Request Body:", req.body);

  try {
    const tripId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      console.log("Invalid trip ID format:", tripId);
      return res.status(400).json({ message: "Invalid trip ID format." });
    }

    const existingTrip = await Trip.findById(tripId);
    if (!existingTrip) {
      console.log("Trip not found for ID:", tripId);
      return res.status(404).json({ message: "Trip not found" });
    }

    const {
      title,
      destination,
      duration,
      inclusives,
      exclusives,
      images,
      dates,
      description,
      catch_phrase,
      itinerary,
      categories,
      blog_contents,
      activities,
      price,
      rating,
      places_visited = [],
      highlights,
    } = req.body;

    // Validate required fields
    if (!title || !destination || !duration || !dates || !price) {
      console.log("Missing required details...");
      return res.status(400).json({
        message: "Error updating trip. Missing required details.",
      });
    }

    // Further processing of destination and places
    const { country, continent, locale } = destination;

    // Log destination details
    console.log("Destination details:", { country, continent, locale });

    const destId = await Destination.findOneAndUpdate(
      { country, continent, locale },
      { country, continent, locale },
      { new: true, upsert: true }
    );

    if (!destId) {
      console.log("Destination could not be created or found");
      return res.status(400).json({ message: "Invalid destination" });
    }

    let placesIds = existingTrip.places_visited;

    // Log existing places IDs
    console.log("Existing places IDs:", placesIds);

    if (places_visited && places_visited.length > 0) {
      const existingPlacesMap = new Map();
      for (const id of placesIds) {
        existingPlacesMap.set(id.toString(), true);
      }

      const newPlacesIds = [];

      for (const place of places_visited) {
        const { country, continent, locale } = place;

        const visitedPlace = await Destination.findOneAndUpdate(
          { country, continent, locale },
          { country, continent, locale },
          { new: true, upsert: true }
        );

        newPlacesIds.push(visitedPlace._id);
      }

      placesIds = [...new Set([...newPlacesIds, ...placesIds])];
    }

    // Log the final places IDs before updating
    console.log("Final places IDs:", placesIds);

    // Update the trip
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      {
        title,
        destination: destId._id,
        duration,
        inclusives,
        exclusives,
        images,
        dates,
        description,
        catch_phrase,
        itinerary,
        categories,
        blog_contents,
        activities,
        price,
        rating,
        places_visited: placesIds,
        highlights,
      },
      { new: true }
    ).populate("destination places_visited blog_contents activities");

    if (!updatedTrip) {
      console.log("Failed to update the trip with ID:", tripId);
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ updatedTrip, status: "updated successfully" });
  } catch (error) {
    console.error("Error updating trip:", error);
    res
      .status(500)
      .json({ message: "Error updating trip", error: error.message });
  }
});

// Delete a trip (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    console.log(req.params.id);
    const deletedTrip = await NewTrip.findByIdAndDelete(req.params.id);
    if (!deletedTrip)
      return res.status(404).json({ message: "Trip not found" });
    res.status(200).json({ message: "Trip deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting trip", error });
  }
});

module.exports = router;
