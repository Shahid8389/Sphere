import { toast } from "react-toastify";

// Fuction to upload the profile picture of the user to the cloudinary
const uploadProfileImage = async (image) => {

  try {

    // Generate a unique file name using Date.now()
    const timestamp = Date.now();
    const customName = `${timestamp}${image.name}`; // Example: 1674512345678_originalfilename.png

    // Create a new File object with the custom name
    const renamedImage = new File([image], customName, { type: image.type });


    const formData = new FormData();

    formData.append('file', renamedImage);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET_NAME); // Enter your preset name
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME); // Enter your cloud name

    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    return data.secure_url;

  } catch (error) {
    console.log(error);
    toast.error("Can't upload user profile image")
  }

};


// Fuction to upload the user chat images to the cloudinary
const uploadChatImage = async (image) => {

  try {

    const timestamp = Date.now();
    const customName = `${timestamp}${image.name}`; // Example: 1674512345678_originalfilename.png

    // Create a new File object with the custom name
    const renamedImage = new File([image], customName, { type: image.type });


    const formData = new FormData();

    formData.append('file', renamedImage);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET2_NAME); // Enter your preset name
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME); // Enter your cloud name

    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    return data.secure_url;

  } catch (error) {
    console.log(error);
    toast.error("Can't upload user chat image")
  }

};

export { uploadProfileImage, uploadChatImage }