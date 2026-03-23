import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
{
  username:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true
  },
  password:{
    type:String,
    required:true,
    minlength:6
  },
  verified:{
    type:Boolean,
    default:false
  }
},
{timestamps:true}
);


// 🔹 password hash middleware
userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10)
})

// 🔹 password compare method
userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password , this.password)
}


const userModel = mongoose.model("user",userSchema)
export default userModel