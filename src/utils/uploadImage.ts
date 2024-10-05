import { ReactiveSwal } from "../components";

export const uploadImage = async (file: File): Promise<string | undefined> => {
  const cloudUrl = 'https://api.cloudinary.com/v1_1/m1dxr7hw/image/upload';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'm1dxr7hw');
  formData.append('api_key', '685115225575362');

  try {
    const resp = await fetch(cloudUrl, {
      method: 'POST',
      body: formData,
    });

    const cloudResp = await resp.json();

    if (!resp.ok) throw cloudResp;

    return cloudResp.secure_url;
  } catch (error) {
    const err = error as Error;
    ReactiveSwal.fire({
      icon: 'error',
      title: 'Error',
      text: err?.message || 'An error occurred while uploading the image'
    });

  }
};