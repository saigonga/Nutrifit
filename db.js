const mongoose = require("mongoose");

const connectToDatabase = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database successfully");
    } catch (error) {
        console.error("Could not connect to database:", error.message);
    }
};

module.exports = connectToDatabase;
    