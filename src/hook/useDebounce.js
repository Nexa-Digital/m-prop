import { useEffect, useState } from "react";

export default function useDebounce(val, time) {
	const [value, setValue] = useState(val);

	useEffect(() => {
		const handler = setTimeout(() => {
			setValue(val);
		}, time);

		return () => clearTimeout(handler);
	}, [val, time]);

	return value;
}