import { RecentlyViewedModel } from "./utils_models";

// applies available 'reports' value to model; returns the model
const updateRecentsModel = (details = {}) => {
	const base = new RecentlyViewedModel(
		details.id,
		details.type,
		details.name,
		details.desc,
		details.dateCreated,
		details.data
	);

	return base.getModel();
};

// UPDATING/POPULATING RECENTLY VIEWED MODEL HELPERS //
export { updateRecentsModel };
