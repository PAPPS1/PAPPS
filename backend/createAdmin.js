import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

async function createAdmins() {
  try {
    // Hash your passwords
    const adminPassword = await bcrypt.hash("PAAPS@321.PAK", 10); // for admin
    const seniorPassword = await bcrypt.hash("Paapers@journey.PAK", 10); // for senior_admin

    // Check if they exist
    const adminExists = await Admin.findOne({ username: "PAAPS.PAK" });
    const seniorExists = await Admin.findOne({ username: "PAAPSno1" });

    if (!adminExists) {
      await Admin.create({
        username: "PAAPS.PAK",
        password: adminPassword,
        role: "admin",
      });
      console.log("Admin created: username=PAAPS.PAK, password=PAAPS@321.PAK");
    } else {
      console.log("Admin already exists");
    }

    if (!seniorExists) {
      await Admin.create({
        username: "PAAPSno1",
        password: seniorPassword,
        role: "senior_admin",
      });
      console.log(
        "Senior Admin created: username=PAAPSno1, password=Paapers@journey.PAK",
      );
    } else {
      console.log("Senior Admin already exists");
    }

    mongoose.disconnect();
  } catch (err) {
    console.log(err);
    mongoose.disconnect();
  }
}

createAdmins();
