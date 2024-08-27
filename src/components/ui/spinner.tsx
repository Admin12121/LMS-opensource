import { Spinner } from "@nextui-org/spinner";

const SpinnerLoader = ({className, color, ...props}: {className?: string, color?:any}) => {
  return <Spinner className={className} color={color ? color : "default" } {...props} />
}

export { SpinnerLoader }