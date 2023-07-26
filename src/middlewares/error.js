export default (error, req, res, next) => {//Este middleware es nuestro salvador que define que nunca caiga el server
    console.log(error);
    res.status(error.status).send({status:"error",error:error.message})
}