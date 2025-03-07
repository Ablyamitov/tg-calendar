import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Value } from "react-calendar/dist/cjs/shared/types";

const Telegram = (window as any).Telegram.WebApp;

interface Event {
	title: string;
	start_time: string;
	url: string;
}

function App() {
	const [events, setEvents] = useState<{ [date: string]: Event[] }>({});
	const [date, setDate] = useState<Value>(new Date()); // Исправленный тип

	useEffect(() => {
		Telegram.ready();
		const user = Telegram.initDataUnsafe?.user;
		if (user) {
			fetch(`/api/events?chat_id=${user.id}`)
				.then((res) => res.json())
				.then(setEvents);
		}
	}, []);

	return (
		<div>
			<h2>📅 Ваш календарь</h2>
			<Calendar
				onChange={(value) => setDate(value)} // Теперь принимает Value
				value={date}
				tileContent={({ date }) => {
					const dateStr = date.toISOString().split("T")[0];
					return events[dateStr] ? "🔴" : null;
				}}
			/>
			{date && typeof date === "object" && "getTime" in date && (
				<div>
					<h3>События на {date.toLocaleDateString()}</h3>
					{events[date.toISOString().split("T")[0]]?.map((event) => (
						<p key={event.url}>
							<a href={event.url} target="_blank">
								{event.title}
							</a>
						</p>
					))}
				</div>
			)}
		</div>
	);
}

export default App;
