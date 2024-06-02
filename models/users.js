const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
 

const userSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String,
    age: String,
    posts: [{                                              // posts: { type: Array }
        type: mongoose.Schema.Types.ObjectId,             // when you use ref: 'users', it should refer to the actual model name,
        ref: "post"
    }],
    profileimage: {
        type: String,
        default: 'default.png'
    }
});


userSchema.pre('save', async function(next) {
    const user = this;
    if(!user.isModified('password')) next();

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    }catch(err){
        console.log('Error: '+ err);
        next(err);
    }
});


userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
};



module.exports = mongoose.model('user_details', userSchema);