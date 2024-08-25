"use client";
import React, { useState , useEffect} from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LuPencilLine } from "react-icons/lu";
import { toast } from "sonner";
import { useGetEncryptedVideoUrlMutation } from "@/lib/store/Service/User_Auth_Api";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/actions/gettoken";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useDropzone } from "react-dropzone";
import { SpinnerLoader } from "@/components/ui/spinner";
import { VideoPlayer } from "@/components/ui/video";
import { PiVideoLight } from "react-icons/pi";
import { Progress } from "@/components/ui/progress";

interface VideoUploaderFormProps {
  slug: string;
  refetch: any;
  onVideoUrlChange: (url: string) => void;
}

const formSchema = z.object({
  video: z.instanceof(File).optional(),
});

const VideoUploaderForm = ({ slug, refetch, onVideoUrlChange }: VideoUploaderFormProps) => {
  const [isEditing, setisEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { video: undefined },
  });
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [getEncryptedVideoUrl] = useGetEncryptedVideoUrlMutation();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [uploadSpeed, setUploadSpeed] = useState('');

  useEffect(() => {
    const fetchEncryptedVideoUrl = async () => {
      const accessToken = await getAccessToken();
      try {
        const { data } = await getEncryptedVideoUrl({ slug, accessToken });
        setVideoUrl(atob(data?.encryptedUrl || "")); 
        onVideoUrlChange(atob(data?.encryptedUrl || ""));
      } catch (error) {
        toast.error("Failed to load video");
      }
    };

    fetchEncryptedVideoUrl();
  }, [slug, getEncryptedVideoUrl, isEditing]);


  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 3000 * 1024 * 1024) {
        toast.error("File size exceeds 2GB");
        return;
      }
      const newVideoUrl = URL.createObjectURL(file);
      setVideoUrl(newVideoUrl);
      form.setValue("video", file);
      setisEditing(true);
      form.handleSubmit(onSubmit)();
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onSubmit = async (value: { video?: File }) => {
    setUploading(true);
    const accessToken = await getAccessToken();
    const formData = new FormData();

    if (value.video) {
      formData.append("video", value.video);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chapters/${slug}/upload-video/`, true);
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);

        const elapsed = Date.now() - startTime;
        const remainingTime = ((event.total - event.loaded) / event.loaded) * elapsed;
        setEstimatedTime(formatTime(remainingTime));

        const speed = (event.loaded / 1024 / 1024 / (elapsed / 1000)).toFixed(2); // Speed in MB/s
        setUploadSpeed(`${speed} MB/s`);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        toast.success("Course video updated");
        refetch();
        setisEditing(false);
      } else {
        toast.error("Failed to update course video");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      toast.error("Upload failed");
    };

    const startTime = Date.now();
    xhr.send(formData);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${minutes}m ${seconds}s`;
  };

  const handleCancel = () => {
    setisEditing(!isEditing);
    form.setValue("video", undefined);
  };

  return (
    <div className="mt-6 dark:bg-neutral-900 rounded-md p-2 px-4">
      <div className="font-medium flex items-center justify-between">
        Course Video
        <Button variant="ghost" onClick={handleCancel} className="p-2 gap-1">
          {isEditing ? "Cancel" : videoUrl ? <><LuPencilLine size={16} /> Update Video</> : <><IoIosAddCircleOutline /> Add a Video</>}
        </Button>
      </div>
      {videoUrl !== "undefined" && !isEditing ?  <VideoPlayer src={videoUrl} /> : <div className="bg-neutral-800 w-full overflow-hidden h-60 my-1 cursor-pointer rounded-md flex items-center justify-center">
        {isEditing ? (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <PiVideoLight size={34} />
          </div>
        ) : (
            <PiVideoLight size={34} />
        )}
        {uploading && (
          <div className="flex flex-col items-center">
            <SpinnerLoader />
            <Progress value={progress} className="w-[60%] mt-2" />
            <p className="text-sm text-gray-300 mt-2">Uploading: {progress}%</p>
            <p className="text-sm text-gray-300">Estimated time left: {estimatedTime}</p>
            <p className="text-sm text-gray-300">Speed: {uploadSpeed}</p>
          </div>
        )}
      </div>}
      { videoUrl == "undefined" || isEditing ? <p className="text-sm text-gray-500">Max file size: 3GB</p> : ""}
    </div>
  );
};

export default VideoUploaderForm;
