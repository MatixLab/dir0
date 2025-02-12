import { zodResolver } from "@hookform/resolvers/zod"
import { ReportType } from "@openalternative/db/client"
import { sentenceCase } from "change-case"
import type { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { reportTool } from "~/actions/report"
import { Button } from "~/components/common/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/common/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { RadioGroup, RadioGroupItem } from "~/components/common/radio-group"
import { TextArea } from "~/components/common/textarea"
import { type ReportSchema, reportSchema } from "~/server/schemas"
import type { ToolMany, ToolManyExtended } from "~/server/web/tools/payloads"

type ToolReportDialogProps = {
  tool: ToolMany | ToolManyExtended
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const ToolReportDialog = ({ tool, isOpen, setIsOpen }: ToolReportDialogProps) => {
  const form = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: ReportType.BrokenLink,
      message: "",
    },
  })

  const { execute, isPending } = useServerAction(reportTool, {
    onSuccess: () => {
      toast.success("Thank you for your report")
      setIsOpen(false)
      form.reset()
    },
    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report {tool.name}</DialogTitle>
          <DialogDescription>What is happening with this tool?</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(data => execute({ toolSlug: tool.slug, ...data }))}
            className="grid gap-6"
            noValidate
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid gap-3"
                    >
                      {Object.values(ReportType).map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <RadioGroupItem value={type} id={`r${type}`} />
                          <FormLabel htmlFor={`r${type}`}>{sentenceCase(type)}</FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (optional)</FormLabel>
                  <FormControl>
                    <TextArea
                      placeholder="Provide additional details about the issue..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>

              <Button variant="destructive" className="min-w-28" isPending={isPending}>
                Report
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
