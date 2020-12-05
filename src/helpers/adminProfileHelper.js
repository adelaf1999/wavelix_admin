import _ from "lodash";

export const getAdminRoles = (roles) => {

    let text = "";

    if(!_.isEmpty(roles)){

        for(let i = 0; i < roles.length; i++){

            const role = roles[i];

            if(i === 0){

                text += _.startCase( role.split("_").join(" ") );

            }else{

                text += ( ", " + _.startCase( role.split("_").join(" ")  ) );

            }

        }

    }


    return text;


};