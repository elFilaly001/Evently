import { Schema } from "mongoose";

export const EventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });