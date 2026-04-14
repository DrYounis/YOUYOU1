import { supabase } from './supabaseClient';

/**
 * Upload an image to Supabase Storage
 * @param {Blob} imageBlob - The compressed image blob
 * @param {string} customerName - Customer name for filename
 * @returns {Promise<string>} - Public URL of the uploaded image
 */
export async function uploadImageToStorage(imageBlob, customerName) {
    // Create a unique filename
    const timestamp = Date.now();
    const sanitizedName = customerName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${timestamp}_${sanitizedName}.jpg`;

    // Upload to Supabase Storage bucket
    const { data, error } = await supabase.storage
        .from('puzzle-images')
        .upload(filename, imageBlob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Upload error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('puzzle-images')
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}
