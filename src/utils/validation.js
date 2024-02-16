export default function (schemaValidation, dataBody ={}) {
    const validationCheck = schemaValidation.safeParse(dataBody);

    let result = { success: validationCheck.success};

    if (validationCheck.success) result.data = validationCheck.data;
    else {
        const errors = validationCheck.error.issues.map((item) => {
            return {
                path: item.path.join("."),
                message: item.message,
            };   
        });
        result.errors = errors;

    }
    
    return result;
}