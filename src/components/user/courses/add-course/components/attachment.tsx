"use client";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import {
  useUpdateCourseMutation,
  useDeleteAttachmentMutation,
} from "@/lib/store/Service/User_Auth_Api";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/actions/gettoken";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useDropzone } from "react-dropzone";
import { SpinnerLoader } from "@/components/ui/spinner";
import { CiFileOn } from "react-icons/ci"; // Importing file icon
import { MdOutlineFileUpload } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
interface AttachmentProps {
  slug: string;
  initialData: {
    attachments: { id: number; attachment: string }[];
  };
  refetch: any;
}

const formSchema = z.object({
  attachments: z.array(z.instanceof(File)).optional(),
});

const Attachment = ({ slug, initialData, refetch }: AttachmentProps) => {
  const [isEditing, setisEditing] = useState<boolean>(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState<number | null>(
    null
  );
  const [deleteAttachment, { isLoading }] = useDeleteAttachmentMutation();
  const [updateTitle] = useUpdateCourseMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { attachments: [] },
  });
  const { isSubmitting } = form.formState;
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const files = acceptedFiles.slice(0, 5);
    let validFiles = true;

    if (files.length) {
      files.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size exceeds 5MB");
          validFiles = false;
          return;
        }
        const currentAttachments = form.getValues("attachments") || [];
        form.setValue("attachments", [...currentAttachments, file]);
      });

      if (validFiles) {
        setisEditing(true);
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onSubmit = async (value: { attachments?: File[] }) => {
    setUploading(true);
    const accessToken = await getAccessToken();
    const formData = new FormData();

    value.attachments?.forEach((attachment) => {
      formData.append("attachments", attachment); // Append each attachment to formData with the same key
    });

    const res = await updateTitle({
      slug,
      value: formData,
      accessToken,
      attach: true,
    });
    setUploading(false);

    if (res?.data) {
      toast.success("Course attachments updated");
      refetch();
      setisEditing(false);
    } else if (res.error) {
      toast.error("Failed to update course attachments");
    }
  };
  const handleDelete = async () => {
    const accessToken = await getAccessToken();
    if (attachmentToDelete !== null && accessToken) {
      const id = attachmentToDelete;
      const res = await deleteAttachment({ id, accessToken });
      refetch();
    }
  };
  const handleCancel = () => {
    setisEditing(!isEditing);
    form.setValue("attachments", []);
  };

  return (
    <div className="mt-6 dark:bg-neutral-900 rounded-md p-2 px-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button variant="ghost" onClick={handleCancel} className="p-2 gap-1">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <IoIosAddCircleOutline /> Add Attachments
            </>
          )}
        </Button>
      </div>
      {isEditing && (
        <div
          className="bg-neutral-800 w-full overflow-hidden h-60 my-1 cursor-pointer rounded-md flex items-center justify-center"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {uploading ? <SpinnerLoader /> : <MdOutlineFileUpload size={34} />}
        </div>
      )}

      {isEditing && <p className="text-sm text-gray-500">Max file size: 5MB</p>}
      {!isEditing && (
        initialData.attachments.length > 0 ? (<div className="mt-4 flex flex-col gap-1">
          {initialData.attachments.map((attachment) => {
            const fileName = attachment.attachment.split("/").pop();

            return (
              <div
                key={attachment.id}
                className="flex items-center justify-between rounded-md gap-2 p-3 bg-zinc-800"
              >
                <span className="flex gap-2">
                  <CiFileOn size={22} strokeWidth={1} />
                  <a
                    href={attachment.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {fileName && fileName.length > 20
                      ? `${fileName.slice(0, 20)}...`
                      : fileName}
                  </a>
                </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setAttachmentToDelete(attachment.id);
                      }}
                    >
                      <IoClose size="22" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this attachment?
                        <p>{fileName}</p>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button loading={isLoading} onClick={handleDelete}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            );
          })}
        </div>) : <p className="text-sm text-gray-500 italic">No attachment yets</p>
      )}
    </div>
  );
};

export default Attachment;
