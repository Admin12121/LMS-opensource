import { Spinner } from "@nextui-org/spinner";

const SpinnerLoader = ({className, ...props}: {className?: string}) => {
  return <Spinner className={className} {...props} />
}

export { SpinnerLoader }