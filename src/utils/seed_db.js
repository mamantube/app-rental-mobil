import roleModel from "../models/roles.js";

export default async function () {
    const findDataRole = await roleModel.find({ deleted_at: null});

    console.log("ini", findDataRole);
}