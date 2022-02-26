import hash from 'crypto-js/sha1';

export const makeUniqueID = (): string => {
	const dateAsANumber = Date.now();
	const randomNumber = Math.random() * 1000;
	const value = String(dateAsANumber + randomNumber);
	return hash(value).toString();
};
