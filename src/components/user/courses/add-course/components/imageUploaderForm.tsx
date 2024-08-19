"use client";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LuPencilLine } from "react-icons/lu";
import { toast } from "sonner";
import { useUpdateCourseMutation } from '@/lib/store/Service/User_Auth_Api';
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/actions/gettoken";
import { IoIosAddCircleOutline } from "react-icons/io";
import Image from 'next/image';
import { FaImage } from "react-icons/fa6";
import { useDropzone } from 'react-dropzone';
import { SpinnerLoader } from "@/components/ui/spinner";

interface TitleFormProps {
  slug: string;
  initialData: {
    image: string;
  };
  refetch: any;
}

const formSchema = z.object({
  image: z.instanceof(File).optional(),
});

const ImageUploaderForm = ({ slug, initialData, refetch }: TitleFormProps) => {
  const [isEditing, setisEditing] = useState(false);
  const [updateTitle, { isLoading }] = useUpdateCourseMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { image: undefined },
  });
  const { isSubmitting } = form.formState;
  const [imageUrl, setImageUrl] = useState(initialData.image);
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        return;
      }
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
      form.setValue('image', file);
      setisEditing(true);
      form.handleSubmit(onSubmit)();
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onSubmit = async (value: { image?: File }) => {
    setUploading(true);
    const accessToken = await getAccessToken();
    const formData = new FormData();

    if (value.image) {
      formData.append('image', value.image);
    }

    const res = await updateTitle({ slug, value: formData, accessToken });
    setUploading(false);

    if (res?.data) {
      toast.success('Course image updated');
      refetch();
      setisEditing(false);
    } else if (res.error) {
      toast.error('Failed to update course image');
    }
  };

  const handleCancel = () => {
    setisEditing(!isEditing);
    setImageUrl(initialData.image);
    form.setValue('image', undefined);
  };

  return (
    <div className="mt-6 dark:bg-neutral-900 rounded-md p-2 px-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="p-2 gap-1"
        >
          {isEditing ? "Cancel" : (initialData.image ? <><LuPencilLine size={16} /> Upload Image</> : <><IoIosAddCircleOutline /> Add an Image</>)}
        </Button>
      </div>
      <div className="bg-neutral-800 w-full overflow-hidden h-60 my-1 cursor-pointer rounded-md flex items-center justify-center" {...getRootProps()}>
        <input {...getInputProps()} />
        {uploading ? <SpinnerLoader /> : (imageUrl && !isEditing ? (
          <Image src={imageUrl} alt={slug} quality={100} width="400" height="300" className="w-full h-full object-cover" />
        ) : (
          <FaImage size={34} />
        ))}
      </div>

      {isEditing && <p className="text-sm text-gray-500">Max file size: 5MB</p>}
    </div>
  );
}

export default ImageUploaderForm;
