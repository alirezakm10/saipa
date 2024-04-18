import { GetForms } from "@/actions/form";
import { FormCard } from "./FormCard";

export async function FormCards() {
    const forms = await GetForms()
    
    return (
      <>
        {forms?.map((form) => (
          <FormCard key={form.id} form={form} />
        ))}
      </>
    );
  }