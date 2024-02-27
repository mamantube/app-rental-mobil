import { Schema, model } from "mongoose";

const storageSchema = new Schema(
    {
        public_id: {
            type: String,
            required: true,    
        },
        secure_url: {
            type: String,
            required: true,    
        },
        deleted_at: {
            type: Date,
            default: null,
        },
    },  
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
);

const storageModel = model("Storages", storageSchema)

export default storageModel;