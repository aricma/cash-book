export interface BookEntriesState {
	create: Create;
	entries: {
		[date: string]: BookEntry;
	};
}

export interface Create {
	selectedTemplateId?: string;
	templates: {
		[templateId: string]: CreateBookEntry;
	};
}

export interface CreateBookEntry {
	templateId: string;
	date: string;
	transactions: {
		[transactionId: string]: string;
	};
}

export interface BookEntry {
	date: string;
	transactions: {
		[transactionId: string]: number;
	};
}

export const initialState: BookEntriesState = {
	create: {
		templates: {},
	},
	entries: {},
};
