"use client"

import Link from "next/link";

interface CourseProps {
    title: string;
    imageUrl: string | null;
    slug: string;
    price?: number | null;
    progress: any | null;
}

const CourseCard = ({title,imageUrl,price,slug,progress}:CourseProps) => {
    return (
        <Link href={`/browser/${slug}`}>
        </Link>
    )
}

export default CourseCard;