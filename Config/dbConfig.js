let ENV = 'DEV'; 
if (ENV == 'LOCAL') {
    module.exports.dbPort = "27017";
    module.exports.dbURL = "mongodb://127.0.0.1:27017/Connect";
    module.exports.dbName = "mytask_uw";
} else if (ENV == 'DEV') {
    module.exports.dbPort = "27017";
    module.exports.dbURL = "mongodb+srv://master:%404321Vasu5@itsmenithin.stgqtvp.mongodb.net/mytask_uw?retryWrites=true&w=majority";
    module.exports.dbName = "mytask_uw";
}
