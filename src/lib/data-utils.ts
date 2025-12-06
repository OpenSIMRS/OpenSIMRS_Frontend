/**
 * Utility function to convert JSON data with null values to TypeScript-compatible format
 * Replaces null values with undefined for optional fields
 */
export function normalizeData<T>(data: any): T {
	if (data === null) return undefined as any;
	if (Array.isArray(data)) return data.map(normalizeData) as any;
	if (typeof data === 'object') {
		const normalized: any = {};
		for (const key in data) {
			normalized[key] = data[key] === null ? undefined : normalizeData(data[key]);
		}
		return normalized;
	}
	return data;
}
