import Image from 'next/image';
import { type ChangeEventHandler, useState } from 'react';
import { ACCEPTED_IMAGE_TYPES } from '../helpers/validators';
import Loading from './Loading';
import { getImagePath } from '@/features/shared/helpers/upload';

export interface AvatarUploaderProps {
  defaultImage?: string;
  onImageChanged: (url: string) => void;
  error?: string | undefined;
}

const AvatarUploader = ({
  defaultImage,
  onImageChanged,
  error,
}: AvatarUploaderProps) => {
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
    previewAvatar(getImagePath(filename));
    onImageChanged(filename);
  };

  return (
    <div className="mx-auto w-48  px-4 py-5 text-center">
      <div className="mb-4">
        <Image
          priority
          src={image}
          alt="Avatar Upload"
          width={100}
          height={100}
          onLoadingComplete={() => setIsButtonDisabled(false)}
          className="mx-auto w-[100px] h-[100px] rounded-full object-cover object-center border-[2px] border-pink-600 p-[1px]"
        ></Image>
      </div>
      {isButtonDisabled ? (
        <Loading></Loading>
      ) : (
        <label className="mt-6 cursor-pointer">
          <span className="mt-2 rounded-full bg-pink-500 px-4 py-2 text-sm leading-normal text-white">
            Select Avatar
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

export default AvatarUploader;
