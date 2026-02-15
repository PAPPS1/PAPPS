import mongoose from "mongoose";

const certificateSettingsSchema = new mongoose.Schema(
  {
    topicName: {
      type: String,
      default: "",
    },
    resourcePerson: {
      type: String,
      default: "",
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("CertificateSettings", certificateSettingsSchema);
