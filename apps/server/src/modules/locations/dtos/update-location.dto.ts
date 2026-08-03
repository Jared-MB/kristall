import { CreateLocationDto } from "./create-location.dto";

/**
 * The edit form resubmits every field, so an update carries the same payload as
 * a creation: optional fields left empty clear the stored value.
 */
export class UpdateLocationDto extends CreateLocationDto {}
