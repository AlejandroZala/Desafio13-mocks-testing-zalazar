import {faker} from '@faker-js/faker/locale/es';
import { generateProduct } from './products.mocks.js';

export const generateUser = () => {
    let numsProducts = faker.number.int({min:0,max:4});
    let products =[];
    for (let i = 0; i < numsProducts; i++){
        products.push(generateProduct());
    }
const roles = ["user", "admin", "seller"];

    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({min:0,max:75}),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(roles),
        premium: faker.datatype.boolean(),
        id: faker.database.mongodbObjectId(),
        products
    }
}