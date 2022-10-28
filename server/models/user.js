const mongoose=require('mongoose')
const {isEmail}=require('validator')
const Schema=mongoose.Schema
const bcrypt=require('bcrypt')

const userSchema= new Schema({
    verified:{type:Boolean,default:false},
    confirmationCode:{type:String},
    otp:{type:String},
    name:{type:String, required:[true,'please enter your name']},
    email:{type:String,
        required:[true, 'please enter email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email']
        },
    password: { type: String, 
        required: [true, 'please enter password'], 
        minlength: [6, 'password should be atleast 6 characters long'] 
    },
    userType:{type:String, required:[true,'please choose who you are..']},
    bloodGroup:String,
    height:String,
    weight:String,
    licence:String,
    gender:String,
    age:Number,
    zip:{type:Number,required:[true,'enter your zip number']},
    city:String,
    photo:{type:String,required:[true,'upload your photo']}
})

userSchema.pre('save',async function (next){
    this.password= await bcrypt.hash(this.password,10)
    next();
})

userSchema.statics.login=async function(email,password){
    const user=await this.findOne({email})
    if(user){
        const auth=await bcrypt.compare(password,user.password)
        if(auth){
            return user
        }else{
            throw Error('incorrect password')
        }
    }else{
        throw Error('incorrect email')
    }
}
const User=mongoose.model('user',userSchema)
module.exports=User;