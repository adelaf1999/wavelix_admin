import _ from "lodash";

export const getFormData = (data) => {

    const bodyFormData = new FormData();

    _.each(data, (value, key) => {

        bodyFormData.append(key, value);

    });

    return bodyFormData;

};