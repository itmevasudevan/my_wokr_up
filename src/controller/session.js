const User = require("../model/mongo").user;
const Count = require("../model/mongo").count;
const Constants =  require("../Lib/constants");
const uuidv1 = require("uuid").v1;

let addCount = 0;
let updateCount = 0;

//ADD USER, METHOD POST 
const addData = async function(req, res) { 
    let user_data = req.body;
    if (!user_data.fname || !user_data.lname || !user_data.mobile) {
        res.status(Constants.BAD_REQUEST);
        return res.send({ type: Constants.ERROR_MSG, message: 'Mandatory Data Missing' });
    }

    let user_db = await User.findOne({ mobile: user_data.mobile, is_active: true, is_deleted: false});
    if(user_db) {
        res.status(Constants.NOT_FOUND);
        return res.send({ type: Constants.ERROR_MSG, message: "Duplicate Mobile number" });
    }
    try {
        const user_data = ({
            user_uid: uuidv1(),
            fname: req.body.fname,
            lname: req.body.lname,
            age: req.body.age,
            gender: req.body.gender,
            mobile: req.body.mobile,
          });
          const save_user = await User(user_data).save();
          await Count.updateOne({}, { $inc: { addCount: 1 } }, { upsert: true });

          res.json(save_user);        
    } catch (error) {
        console.error('Error creating User:', error);       
        res.status(Constants.INTERNAL_ERROR).send({ type: Constants.ERROR_MSG, message: Constants.INTERNAL_SERVER_ERROR });
    }

};

//UPDATE USER, METHOD PUT 
const updateData = async function(req, res) {
    const  user_uid  = req.params.user_uid;   
    if (!user_uid) {
        res.status(Constants.BAD_REQUEST);
        return res.send({ type: Constants.ERROR_MSG, message: "Mandatory Data Missing" });
    }
     //VALIDATE UID 
     let user_db = await User.findOne({ user_uid: user_uid, is_deleted: false, is_active: true });
     let update_data = req.body;
     if(!user_db) {
         res.status(Constants.NOT_FOUND);
         return res.send({ type: Constants.ERROR_MSG, message: "Invalid User UID" });
     }
            
     let keys_to_omit_in_update = ['user_uid', 'created_at', 'is_deleted', 'created_by']; 
     for (const omit_key of keys_to_omit_in_update) {
         delete update_data[omit_key];
     }

     try {
     //UPDATE USER DATA
     const save_data = await User.findOneAndUpdate(
       { user_uid, is_deleted: false },
       { $set: update_data },
       { new: true }
     ).lean();
    
     await Count.updateOne({}, { $inc: { updateCount: 1 } }, { upsert: true });
     res.status(Constants.SUCCESS);
      return res.send({ type: Constants.SUCCESS_MSG, data: { user_uid: save_data.user_uid, ...update_data } });
    } catch (error) {
      console.error('Error updating user:', error);     
      res.status(Constants.INTERNAL_ERROR).send({ type: Constants.ERROR_MSG, message: Constants.INTERNAL_SERVER_ERROR });
    }
   
 };

// Count API to retrieve counts from the database
const getCount = async function(req, res) {
    try {       
        const countData = await Count.findOne({});
        if (!countData) {
            return res.status(Constants.NOT_FOUND).json({ message: "Counts not found" });
        }
        res.json(countData); 
    } catch (error) {
        console.error('Error retrieving counts:', error);
        res.status(Constants.INTERNAL_ERROR).send({ type: Constants.ERROR_MSG, message: Constants.INTERNAL_SERVER_ERROR });
    }
};


const getUser = async function(req, res) {
    try {
        const user_uid = req.params.user_uid;         
        

        if (!user_uid) {    
            res.status(Constants.BAD_REQUEST);
            return res.send({ type: Constants.ERROR_MSG, message: "Mandatory Data Missing" });
        }

        const user_db = await User.findOne({user_uid: user_uid, is_active: true, is_deleted: false}); 
        if(!user_db) {
            res.status(Constants.NOT_FOUND);
            return res.send({ type: Constants.ERROR_MSG, message: "Invalid User UID" });
        }

        res.json(user_db);
    } catch (error) {    
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getUserAll = async function(req, res) {
    try {        
        const user_db = await User.find({ is_active: true, is_deleted: false}); 
        if(!user_db) {
            res.status(Constants.NOT_FOUND);
            return res.send({ type: Constants.ERROR_MSG, message: "Invalid User UID" });
        }

        res.json(user_db);
    } catch (error) {    
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

};

module.exports = { 
    addData: addData,
    updateData: updateData,
    getCount: getCount,
    getUser:getUser,
    getUserAll:getUserAll
};
