import userModel from "../models/users.js";

export default class UserManager {
    constructor() {
        this.users = [];
    }

    getUsers = () =>{
        return this.users;
    }

    saveUser = (user) => {
        this.users.push(user);
        return user;
    }

}

// import userModel from "../models/users.js";

// export default class UserManager {

//     getUserBy = param => userModel.findOne(params).lean();
//     createUser = user => userModel.create(user);
//     updateUser = (id, user) => userModel.findOneAndUpdate(id, {$set:user})


//     getUsers = async () => {
//         return userModel.find().lean();
//     };

//     updateOne = (parm, elem) => {
//         return userModel.updateOne(parm, elem);
//     };

//     deleteUsers = (id) => {
//         return userModel.findByIdAndDelete(id);
//     };
// };