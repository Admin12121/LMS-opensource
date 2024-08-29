import Link from "next/link";
import Image from "next/image";
import { PiBookOpenTextLight } from "react-icons/pi";
interface CourseProps {
  title: string;
  imageUrl: string | null;
  slug: string;
  price?: number | null;
  progress: any | null;
  category: string;
  chapter_length: number;
}

const CourseCard = ({
  title,
  imageUrl,
  price,
  slug,
  progress,
  chapter_length,
  category,
}: CourseProps) => {
  return (
    <Link href={`/browser/${slug}`}>
      {/* <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                     fill
                     className="object-cover"
                     alt={title}
                     src={imageUrl!}
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">{category}</p>
                    <div className="flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <PiBookOpenTextLight/>
                            <span>{chapter_length} {chapter_length === 1 ? "Chapter" : "Chapters"}</span>
                        </div>
                    </div>
                    {progress !==null ? (
                        <div>TODO</div>
                    ):(<p className="text-md md:text-sm font-medium text-slate-600">{price}</p>)}
                </div>
            </div> */}
      <div className="relative flex w-80 flex-col rounded-xl light:bg-white dark:bg-neutral-900 bg-clip-border light:text-gray-700 shadow-md">
        <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r from-blue-500 to-blue-600">
            <Image
            src={imageUrl ?  imageUrl:""}
            alt={title}
            width={100}
            height={100}
            quality={100}
            priority 
            className="w-full h-full object-cover"
            ></Image>
        </div>
        <div className="p-6">
          <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
            {title}
          </h5>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <span className="border-1 rounded-full p-2"><PiBookOpenTextLight /></span>
              <span>
                {chapter_length} {chapter_length === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {/* {progress !== null ? (
            <div>TODO</div>
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-600">
              {price}
            </p>
          )} */}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
