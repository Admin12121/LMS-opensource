import {cn} from "@/lib/utils"

interface HeaderProps {
 label: string;
}

export const Header = ({label}: HeaderProps) => {
    return(
        <div className="w-full flex flex-col items-center justify-center gap-y-4">
            <h1 className={cn("text-2xl font-bold mt-4")}>Auth</h1>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    )
}

