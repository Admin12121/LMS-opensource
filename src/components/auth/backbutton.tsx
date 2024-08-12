import Link from "next/link";
import { Button } from "../ui/button"

interface BackButtonProps {
    label: string;
    href: string;
    className?: string;
}

export const BackButton = ({label, href, className}: BackButtonProps) => {
    return(
        <Button variant="link" size="sm" asChild className={className}>
                <Link href={href}>{label}</Link>
        </Button>
    )
}