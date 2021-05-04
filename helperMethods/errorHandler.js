"use strict";
 
/**
 * Get unique error field name
 */
const uniqueFieldMessage = error => {
    let output;
    if (error.message.indexOf("email")!== -1) {
        output = "Det finns redan ett konto med denna e-postadress";
    }
    else {
        output = "Redan upptaget";
    }
    return output;
};
 
/**
 * Get the erroror message from error object
 */
exports.errorHandler = error => {
    console.log(error);
    let message = "";
 
    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueFieldMessage(error);
                break;
            default:
                message = "Någonting gick fel";
        }
    } else {
        message = "Någonting gick fel";
    }
 
    return message;
};