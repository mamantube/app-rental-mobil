import roleModel from "../models/roles.js";
import userModel from "../models/users.js";
import bcrypt from "bcrypt";
import { EMAIL_ADMIN, PASSWORD_ADMIN } from "./unpublished.js";

export default async function () {
    const findDataRole = await roleModel.find({ deleted_at: null});
    const findDataUser = await userModel.find({ deleted_at: null});

    if (!findDataRole.length) {
        let roleList = [{name: "admin"}, {name: "customer"}];

        await roleModel.insertMany(roleList)
    }

    if (!findDataUser.length) {
        const findRoleAdmin = await roleModel.findOne({ name: "admin", deleted_at: null});

        const passwordHashing = bcrypt.hashSync(PASSWORD_ADMIN, 10);

        let dataAdmin = {
            first_name: "Super",
            last_name: "Admin",
            phone: "+62895534655956",
            email: EMAIL_ADMIN,
            password: passwordHashing,
            role_id: findRoleAdmin._doc._id,
        };

        await userModel.create(dataAdmin)
    }

    return;
}