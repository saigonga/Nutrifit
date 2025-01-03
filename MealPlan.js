const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
            validator: function (value) {
                return mongoose.Types.ObjectId.isValid(value);
            },
            message: "Invalid user ID",
        },
    },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    age: { type: Number, required: true },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
    },
    activityLevel: {
        type: String,
        enum: ["sedentary", "lightlyActive", "moderatelyActive", "veryActive", "extraActive"],
        required: true,
    },
    dietType: {
        type: String,
        enum: ["vegetarian", "vegan", "keto", "paleo", "omnivore"],
    },
    calorieNeeds: { type: Number, required: true },
    meals: {
        type: [
            {
                id: Number,
                imageType: String,
                title: String,
                readyInMinutes: Number,
                servings: Number,
                sourceUrl: String,
            },
        ],
        default: [],
    },
    nutrients: {
        calories: Number,
        protein: Number,
        fat: Number,
        carbohydrates: Number,
    },
    createdAt: { type: Date, default: Date.now },
});

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);
module.exports = MealPlan;
