"use client";

import { createContext, use } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { LocationFormFields as Fields } from "@/modules/locations/utils/form-state";

/** `FieldError` wants objects; the action reports plain messages. */
function toFieldErrors(errors: string[] | undefined) {
  return errors?.map((message) => ({ message }));
}

interface LocationFormContextValue {
  fields?: Fields;
  message?: string;
  attempt: number;
}

const LocationFormContext = createContext<LocationFormContextValue | null>(
  null,
);

function useLocationForm() {
  const context = use(LocationFormContext);

  if (!context) {
    throw new Error("LocationForm parts must be used within <LocationForm />");
  }

  return context;
}

/**
 * The `<form>` and its state, with no chrome of its own: whoever renders it
 * (a dialog, a window, a page) composes the header, the fields and the actions
 * as children.
 */
export function LocationForm({
  fields,
  message,
  action,
  attempt,
  className,
  children,
}: {
  fields?: Fields;
  /** Top-level failure message, when the API sends one instead of field errors. */
  message?: string;
  action: (formData: FormData) => void;
  /**
   * Submission counter. Keying the inputs on it remounts them after every
   * attempt, so `defaultValue` repaints what the user typed rather than
   * depending on the ordering of React's post-action form reset.
   */
  attempt: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <LocationFormContext value={{ fields, message, attempt }}>
      <form action={action} className={className}>
        {children}
      </form>
    </LocationFormContext>
  );
}

export function LocationFormFields() {
  const { fields, message, attempt } = useLocationForm();

  return (
    <>
      {message ? (
        <p role="alert" className="text-destructive text-sm">
          {message}
        </p>
      ) : null}
      <FieldGroup key={attempt}>
        <Field data-invalid={!!fields?.name.errors?.length}>
          <FieldLabel htmlFor="name">Nombre</FieldLabel>
          <Input
            defaultValue={fields?.name.value}
            name="name"
            id="name"
            placeholder="Almacén"
            aria-invalid={!!fields?.name.errors?.length}
          />
          <FieldError errors={toFieldErrors(fields?.name.errors)} />
        </Field>
        <Field data-invalid={!!fields?.address.errors?.length}>
          <FieldLabel htmlFor="address">Dirección</FieldLabel>
          <Input
            defaultValue={fields?.address.value}
            name="address"
            id="address"
            placeholder="Poniente 3"
            aria-invalid={!!fields?.address.errors?.length}
          />
          <FieldError errors={toFieldErrors(fields?.address.errors)} />
        </Field>
        <Field data-invalid={!!fields?.phone.errors?.length}>
          <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
          <Input
            defaultValue={fields?.phone.value}
            name="phone"
            id="phone"
            placeholder="+00 000 000 0000"
            aria-invalid={!!fields?.phone.errors?.length}
          />
          <FieldError errors={toFieldErrors(fields?.phone.errors)} />
        </Field>
      </FieldGroup>
    </>
  );
}

/** Reads the pending state from the surrounding `<form>`, so no prop drilling. */
export function LocationFormSubmit({
  pendingLabel,
  children,
}: {
  pendingLabel: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner /> : null}
      {pending ? pendingLabel : children}
    </Button>
  );
}
