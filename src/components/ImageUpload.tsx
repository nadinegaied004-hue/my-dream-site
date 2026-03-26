import { useState } from "react";
import { useLang } from "@/context/LangContext";

interface ImageUploadProps {
  images?: string[];
  onImagesChange?: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload = ({ images = [], onImagesChange, maxImages = 4 }: ImageUploadProps) => {
  const { t } = useLang();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(t(`Maximum ${maxImages} images autorisées`));
      return;
    }

    setUploading(true);

    // Simulation d'upload (à remplacer par vrai upload vers serveur/S3)
    // const formData = new FormData();
    // Array.from(files).forEach(file => formData.append('images', file));
    // const response = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });
    // const uploadedUrls = await response.json();

    // Simulation avec URLs locales pour l'instant
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Créer des URLs locales pour la démo
    const newImages = Array.from(files).map((file, idx) => 
      URL.createObjectURL(file)
    );
    
    const updatedImages = [...images, ...newImages];
    
    if (onImagesChange) {
      onImagesChange(updatedImages);
    }
    
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, idx) => idx !== index);
    if (onImagesChange) {
      onImagesChange(updatedImages);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">{t("Photos du logement")}</label>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div key={idx} className="relative group">
            <img 
              src={img} 
              alt={`Image ${idx + 1}`} 
              className="w-full h-24 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <label className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <span className="text-2xl text-gray-400">+</span>
            <span className="text-xs text-gray-400">{t("Ajouter")}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>
      
      {uploading && (
        <p className="text-sm text-muted-foreground">{t("Upload en cours...")}</p>
      )}
      
      <p className="text-xs text-muted-foreground">
        {t("Formats acceptés: JPG, PNG. Maximum")} {maxImages} {t("images")}
      </p>
    </div>
  );
};

export default ImageUpload;