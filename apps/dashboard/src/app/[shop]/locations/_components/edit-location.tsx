"use client";

import type { Location } from "@kristall/api";
import { startTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  useDialog,
} from "@/components/ui/dialog";
import { updateLocation } from "@/modules/locations/services/update-location.action";
import {
  type LocationFormState,
  toFormState,
} from "@/modules/locations/utils/form-state";
import {
  LocationForm,
  LocationFormFields,
  LocationFormSubmit,
} from "./location-form";

export function EditLocation({
  children,
  location,
}: {
  children: React.ReactElement;
  location: Location;
}) {
  return (
    <Dialog>
      <DialogTrigger render={children} />
      <DialogContent>
        <EditLocationForm location={location} />
      </DialogContent>
    </Dialog>
  );
}

interface EditState {
  attempt: number;
  result: LocationFormState<Location>;
}

function EditLocationForm({ location }: { location: Location }) {
  const { setOpen } = useDialog();

  const [{ attempt, result }, action] = useActionState(
    async (prev: EditState, formData: FormData): Promise<EditState> => {
      const result = await updateLocation(formData, location._id);

      if (result?.success) {
        startTransition(() => setOpen(false));
      }

      return { attempt: prev.attempt + 1, result };
    },
    { attempt: 0, result: undefined },
  );

  // The page already rendered this location, so the form seeds itself from the
  // prop and only swaps to the action's fields once a submission comes back.
  const storedFields = toFormState(location).error?.fields;

  return (
    <LocationForm
      action={action}
      attempt={attempt}
      fields={result?.error?.fields ?? storedFields}
      message={result?.error?.message}
    >
      <div className="flex flex-col gap-6 p-2 pb-6">
        <DialogHeader>
          <DialogTitle render={<h3 />}>Editar ubicación</DialogTitle>
        </DialogHeader>
        <LocationFormFields />
      </div>
      <DialogFooter>
        <DialogClose render={<Button variant="outline" type="button" />}>
          Cancelar
        </DialogClose>
        <LocationFormSubmit pendingLabel="Guardando cambios…">
          Guardar cambios
        </LocationFormSubmit>
      </DialogFooter>
    </LocationForm>
  );
}
