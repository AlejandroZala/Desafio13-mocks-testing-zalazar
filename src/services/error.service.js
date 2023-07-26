
export default class ErrorService {
    static createError({name="Error",cause, message, code=1}){
        const error = new Error(message,[cause]);
        error.name=name,
        error.code=code
        //Una vez que tenga el error LISTO => LO LANZO
        throw error;
    }
}