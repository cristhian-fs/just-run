import { Button } from "@/components/ui/button"
import { useMultiStepForm } from "./stepped-form";


const PrevButton = () => {
  const { isFirstStep, previousStep } = useMultiStepForm()

  return (
    <Button
      variant='ghost'
      type='button'
      className="w-full"
      onClick={previousStep}
      disabled={isFirstStep}
    >
      Anterior
    </Button>
  )
}
export default PrevButton