// Older uploads were stored with http:// Cloudinary URLs; browsers flag those as mixed content
// on the https site. Serve every image over https.
export const secureUrl = (url) => (typeof url === "string" ? url.replace(/^http:\/\//i, "https://") : url);
