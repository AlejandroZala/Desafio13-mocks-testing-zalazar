import {faker} from  '@faker-js/faker/locale/es';

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({min: 0, max:30}),
        thumbnail: faker.image.avatar(),
        code: faker.number.hex({min:5000, max:10000}),
        status: faker.datatype.boolean(),
        id: faker.database.mongodbObjectId()
    }
}