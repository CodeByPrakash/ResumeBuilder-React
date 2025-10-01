import mongoose from "mongoose";
const ResumeSchema = new mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    thumbnailLink: {
        type: String
    },
    template: {
        theme: String,
        colorPalette: [String]
    },

    profileInfo: {
        profilePreviewUrl: String,
        fullName: String,
        designation: String,
        summary: String
    },
    contactInfo: {
        email: String,
        phone: String,
        location: String,
        linkedIn: String,
        githubLink: String,
        website: String
    },

    // WORK EXp
    workExperience: [
        {
            company: String,
            role: String,
            startDate: String,
            endDate: String,
            description: String,
        },
    ],
    education:[
        {
            degree: String,
            institute: String,
            startDate: String,
            endData: String,
        },
    ],
    skills: [
        {
            name: String,
            progress: Number,
        },
    ],
    projects: [
        {
            title: String,
            description: String,
            github: String,
            liveDemo: String, 
        },
    ],
    certification: [
        {
        title: String,
        issuer: String,
        year: String,
        },
    ],
    language:[
        {
            name: String,
            progress: Number,
        },
    ],
    interest: [String],

},
{
    timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"}
}
);

export default mongoose.model("Resume", ResumeSchema)