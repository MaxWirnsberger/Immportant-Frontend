import * as React from "react"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface YearPickerProps {
    onChange?: (year: number | null) => void;
    value?: number | null;
  }

export function YearPicker({ onChange, value }: YearPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [year, setYear] = React.useState<number | null | undefined>(value);
  const [decade, setDecade] = React.useState(Math.floor((year || new Date().getFullYear()) / 10) * 10)

  const years = Array.from({ length: 10 }, (_, i) => decade + i)

  const handleYearSelect = (selectedYear: number) => {
    setYear(selectedYear)
    if (onChange && typeof onChange === 'function') {
      onChange(selectedYear)
    }
    setOpen(false)
  }

  React.useEffect(() => {
    setYear(value);
  }, [value]);

  const handlePreviousDecade = () => setDecade(decade - 10)
  const handleNextDecade = () => setDecade(decade + 10)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !year && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {year ? year : <span>Jahr auswählen</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <div className="flex items-center justify-between p-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousDecade}
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {decade} - {decade + 9}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextDecade}
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-48">
          <div className="grid grid-cols-3 gap-2 p-2">
            {years.map((y) => (
              <Button
                key={y}
                onClick={() => handleYearSelect(y)}
                variant={year === y ? "default" : "outline"}
                className="h-9 w-full p-0 font-normal"
              >
                {y}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}