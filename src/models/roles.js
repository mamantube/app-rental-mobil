import { Schema, model } from "mongoose";

const rolesSchema = new Schema(
    {
        name: {
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

const roleModel = model("Roles", rolesSchema)

export default roleModel;