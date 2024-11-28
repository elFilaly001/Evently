import { Schema } from 'mongoose';

export const InscriptionSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    participant: { 
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        // National_ID
        NID: { type: String, required: true },
    },
}, { timestamps: true });
