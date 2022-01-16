export interface BookEntriesState {
	create: Create;
	selectedTemplateId?: string;
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
	diffTransaction?: { transactionId: string; value: number };
	transactions: {
		[transactionId: string]: string;
	};
}

export interface BookEntry {
	date: string;
	templateId: string;
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
