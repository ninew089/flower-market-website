import Image from 'next/image';
import { type ChangeEventHandler, useState } from 'react';
import { ACCEPTED_IMAGE_TYPES } from '../helpers/validators';
import Loading from './Loading';

export interface FlowerUploaderProps {
  defaultImage?: string;
  onImageChanged: (url: string) => void;
  error?: string | undefined;
}

const FlowerUploader = ({
  defaultImage,
  onImageChanged,
  error,
}: FlowerUploaderProps) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [image, setImage] = useState(
    defaultImage ?? '/assets/images/avatar.png',
  );

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('file', image);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = (await res.json()) as { filename: string };

    return data.filename;
  };

  const previewAvatar = (image: string) => {
    setImage(image);
  };

  const handleImageUpload: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const image = event.target.files?.[0];

    if (!image) return;

    setIsButtonDisabled(true);
    const filename = await uploadImage(image);
    previewAvatar(`/uploads/${filename}`);
    onImageChanged(filename);
  };

  return (
    <div className="mx-auto   px-4 py-5 text-center">
      <div className="mb-4">
        <Image
          priority
          src={image}
          alt="Flower Upload"
          width={240}
          height={240}
          onLoadingComplete={() => setIsButtonDisabled(false)}
          className="mx-auto w-[240px] h-[240px] rounded-xl object-cover object-center border-[2px] border-pink-600 p-[1px]"
        ></Image>
      </div>
      {isButtonDisabled ? (
        <Loading></Loading>
      ) : (
        <label className="mt-6 cursor-pointer">
          <span className="mt-2 rounded-md bg-pink-500 px-4 py-2 text-sm leading-normal text-white">
          Upload your flower
          </span>
          <input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(', ')}
            className="hidden"
            onChange={handleImageUpload}
          ></input>
        </label>
      )}

      <div className="mt-2 text-sm text-red-500">{error}</div>
    </div>
  );
};

export default FlowerUploader;
