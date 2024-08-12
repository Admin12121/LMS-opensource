import {cn} from "@/lib/utils"

interface HeaderProps {
 label: string;
 className?: string;
}

export const Header = ({label, className}: HeaderProps) => {
    return(
        <div className={cn("w-full flex flex-col items-center justify-center gap-y-4", className)}>
            <h1 className={cn("text-2xl font-bold mt-4")}>Auth</h1>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    )
}

