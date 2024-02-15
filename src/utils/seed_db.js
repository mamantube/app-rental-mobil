import roleModel from "../models/roles.js";

export default async function () {
    const findDataRole = await roleModel.find({ deleted_at: null});

    if (!findDataRole.length) {
        let roleList = [{name: "admin"}, {name: "customer"}];

        await roleModel.insertMany(roleList)
    }
    console.log("ini", findDataRole);
    return;
}