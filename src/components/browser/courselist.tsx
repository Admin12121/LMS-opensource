import React, {useState, useEffect} from 'react'
import CourseCard from "@/components/browser/courseCard"
import { SpinnerLoader as Spinner} from "@/components/ui/spinner";
interface Course {
    id: number;
    title: string;
    image: string | null;
    courseslug: string;
    price: number | null;
    isPublished: boolean;
    user_progress: any | null;
}

interface CourseListDataProps {
    count: number;
    next: string | null;
    previous: string | null;
    results: Course[];
}

interface CourselistProps{
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    isLoading : boolean;
    data: CourseListDataProps;
}

const Courselist = ({setSearch,setPage, data, isLoading}:CourselistProps) => {
    const [course, setCourse] = useState<Course[] | null>(null);

    useEffect(() => {
      if (data) {
        setCourse(data.results)
      }
    }, [data]);
  return (
    <>
    {isLoading ? <span className="w-full h-full flex items-center justify-center"><Spinner/></span> :
     (<>
        {data.results ? <span className="w-full h-full flex items-center justify-center">No courses found</span> : 
        (<>
           <div className='grid sm:grid-cols-2 md:grid-cols-2 lg: grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4'>
                {course && course.map((item)=>(
                    <CourseCard
                     key={item.id}
                     title={item.title}
                     imageUrl={item.image}
                     price={item.price}
                     slug={item.courseslug}
                     progress={item.user_progress}
                    />
                ))}
           </div>
         </>)}
     </>)
     }
    </>
  )
}

export default Courselist