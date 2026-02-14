const Profile = require('../models/Profile');
const supabase = require('../config/supabase');

// Get profile
exports.getProfile = async (req, res) => {
  try {
    // Get the first profile (single admin profile)
    const profile = await Profile.findOne();
    console.log('Returning profile with projects:', profile?.projects);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or Update profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const profileData = req.body;
    console.log('Received profile data with projects:', profileData.projects);
    
    // Check if profile exists
    let profile = await Profile.findOne();
    
    if (profile) {
      // Update existing profile
      profile = await Profile.findByIdAndUpdate(
        profile._id,
        profileData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      profile = new Profile(profileData);
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Upload image to Supabase
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    const bucketName = process.env.SUPABASE_BUCKET;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    res.json({ 
      message: 'Image uploaded successfully',
      imageUrl: urlData.publicUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete profile
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Delete image from Supabase if exists
    if (profile.profileImage) {
      const fileName = profile.profileImage.split('/').pop();
      await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .remove([fileName]);
    }

    // Delete cover photo from Supabase if exists
    if (profile.coverPhoto) {
      const coverFileName = profile.coverPhoto.split('/').pop();
      await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .remove([coverFileName]);
    }

    await Profile.findByIdAndDelete(profile._id);
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
