import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API TO REGISTER USER

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing details" });
    }
    // VALIDATING EMAIL FORMAT
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    // VALIDATING STRONG PASSWORD
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a Strong password" });
    }
    // HASHING USER PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API FOR USER LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API TO GET USER PROFILE DATA
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API TO UPDATE USER PROFILE
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    // Update user profile
    const updatedData = {
      name,
      phone,
      dob,
      gender,
      address: typeof address === "string" ? JSON.parse(address) : address,
    };

    let updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (imageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { image: imageURL },
        { new: true }
      );
    }

    res.json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API TO BOOK APPOINTMENT
const bookAppointment = async(req,res)=>{
  try {
    const {userId,docId,slotDate,slotTime} = req.body
    const docData = await doctorModel.findById(docId).select('-password')

    if(!docData.available){
      return res.json({success:false,message:'Doctor Not Available'})
    }
    let slots_booked = docData.slots_booked
    // checking for slot availability
    if(slots_booked[slotDate]){
      if(slots_booked[slotDate].includes(slotTime)){
        return res.json({success:false,message:'Slot Not Available'})
      }
      else{
        slots_booked[slotDate].push(slotTime)
      }
    }
    else{
      slots_booked[slotDate]=[]
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')

    delete docData.slots_booked

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount:docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    }
    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    // save new slots data in doc data
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})
    res.json({success:true,message:"Appointment Booked"})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment };
