export interface BookEntriesState {
	create: CreateBookEntry,
	entries: {
		[date: string]: BookEntry,
	}
}

export interface CreateBookEntry {
	date?: string;
	cash: {
		start?: string;
		end?: string;
	},
	transactions: {
		[transactionId: string]: string;
	};
}

export interface BookEntry {
	date: string,
	cash: {
		start: number;
		end: number;
	},
	transactions: {
		[transactionId: string]: number;
	};
}

export const initialState: BookEntriesState = {
	create: {
		cash: {},
		transactions: {},
	},
	entries: {},
};

