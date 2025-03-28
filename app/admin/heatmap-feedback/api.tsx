export interface HeatmapPoint {
    x: number;
    y: number;
    msg: string;
}

export const fetchImageData = async (imageId: string) => {
  try {
    if (!imageId) return null;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getImageById/${imageId}`);
    const metadata = await response.json();

    if (metadata && metadata.image_path) {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/view/${encodeURIComponent(metadata.image_path)}`;
      const imageResponse = await fetch(apiUrl);
      if (!imageResponse.ok) {
        throw new Error("Failed to fetch the image");
      }

      const imageBlob = await imageResponse.blob();
      const imageUrl = URL.createObjectURL(imageBlob);

      return {
        imageUrl,
        imageWidth: 600,
        imageHeight: 400,
        feedbackDots: [],
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching image data:", error);
    return null;
  }
};

export const fetchImageDetails = async (imageId: string) => {
  try {
    if (!imageId) return null;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getImageData/${imageId}`);
    
    if (!response.ok) {
      console.error(`Failed to fetch image data: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();

    if (data && !data.error) {
      return {
        age: data.age || null,
        gender: data.gender || null,
        disease: data.disease || null,
        uploadTime: data.upload_time || null,
        imagePath: data.image_path || null,
        imageType: data.image_type || null,
        imageId: data.image_id || null,
      };
    } else {
      console.error("Error: Image data not found or API response contains error:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching image data:", error);
    return null;
  }
};



export const fetchFeedbackData = async (imageId: string): Promise<HeatmapPoint[]> => {
  try {
    const feedbackResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getMatchingFeedbackForImage/${imageId}`);
    let feedbackData = await feedbackResponse.json();

    if (!Array.isArray(feedbackData)) {
      feedbackData = [];
    }

    return feedbackData;
  } catch (error) {
    console.error("Error fetching feedback data:", error);
    return [];
  }
};

export const fetchMlMetrics = async (imageId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getImageMlMetrics/${imageId}`);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      console.error("Failed to fetch ML metrics:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching ML metrics:", error);
    return null;
  }
};