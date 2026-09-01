const upload_preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const cloud_name = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

const api_url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

export const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", upload_preset);
    data.append("cloud_name", cloud_name);

    const res = await fetch(api_url, {
        method: "post",
        body: data,
    });

    if (!res.ok) {
        throw new Error("Image upload failed");
    }

    const fileData = await res.json();
    // secure_url is https; the plain `url` field is http and would be
    // blocked as mixed content on an https site.
    return fileData.secure_url || fileData.url;
};
