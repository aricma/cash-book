export interface BookEntriesState {
	create: Create;
	selectedTemplateId?: string;
	templates: {
		[templateId: string]: {
			[date: string]: BookEntry;
		};
	};
}

export interface Create {
	templates: {
		[templateId: string]: CreateBookEntry;
	};
}

export interface CreateBookEntry {
	templateId: string;
	date: string;
	diffTransaction?: { transactionId: string; value: string };
	cash: {
		start: string;
		end: string;
	};
	transactions: {
		[transactionId: string]: string;
	};
}

export interface BookEntry {
	date: string;
	templateId: string;
	cash: {
		start: string;
		end: string;
	};
	transactions: {
		[transactionId: string]: string;
	};
}

export const initialState: BookEntriesState = {
	create: {
		templates: {},
	},
	templates: {},
};
