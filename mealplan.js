const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config(); // Load environment variables

// POST route for meal plan generation
router.post("/", async (req, res) => {
  const { height, weight, age, gender, activityLevel, dietType, userId } = req.body;

  // Activity multipliers for calorie calculation
  const activityMultipliers = {
    sedentary: 1.2,
    lightlyActive: 1.375,
    moderatelyActive: 1.55,
    veryActive: 1.725,
    extraActive: 1.9,
  };

  // Calculate BMR based on gender
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Adjust BMR for activity level
  const calorieNeeds = bmr * (activityMultipliers[activityLevel] || 1.2);
  console.log("Calculated Calories: ", calorieNeeds); // Log calculated calorie needs

  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Spoonacular API key is missing" });
    }

    // Fetch meal plan data from Spoonacular API
    const response = await axios.get(
      "https://api.spoonacular.com/mealplanner/generate",
      {
        params: {
          timeFrame: "day",
          targetCalories: Math.round(calorieNeeds),
          diet: dietType,
          apiKey: apiKey,
        },
      }
    );

    console.log("API Response: ", response.data); // Log the raw response from Spoonacular API

    const mealPlan = {
      meals: {
        breakfast: response.data.meals.filter(meal => meal.type === 'breakfast').map(meal => ({
          id: meal.id,
          title: meal.title,
          imageType: meal.imageType,
          readyInMinutes: meal.readyInMinutes,
          servings: meal.servings,
          sourceUrl: meal.sourceUrl
        })),
        lunch: response.data.meals.filter(meal => meal.type === 'lunch').map(meal => ({
          id: meal.id,
          title: meal.title,
          imageType: meal.imageType,
          readyInMinutes: meal.readyInMinutes,
          servings: meal.servings,
          sourceUrl: meal.sourceUrl
        })),
        dinner: response.data.meals.filter(meal => meal.type === 'dinner').map(meal => ({
          id: meal.id,
          title: meal.title,
          imageType: meal.imageType,
          readyInMinutes: meal.readyInMinutes,
          servings: meal.servings,
          sourceUrl: meal.sourceUrl
        }))
      },
      nutrients: response.data.nutrients, // Nutritional data
    };

    console.log("Formatted Meal Plan: ", mealPlan); // Log the formatted meal plan

    res.status(200).json(mealPlan); // Return the formatted meal plan
  } catch (error) {
    console.error("Error fetching meal plan:", error.message);
    res.status(500).json({ message: "Failed to fetch meal plan", error: error.message });
  }
});

module.exports = router;
