import mongoose, { Schema } from "mongoose";

const FeedbackSchema = new Schema(
    {
      name: String,
      email: String,
      message: String,
    },
    {
      timestamps: true,
    }
  )
  
  
  export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);