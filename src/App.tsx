import { For, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";

function App() {
  const [month, setMonth] = createSignal(0);
  const [year, setYear] = createSignal(0);
  const [calendars, setCalendars] = createStore<
    { type: "padding" | "date"; date: number | null; pasar?: number }[]
  >([]);
  const [padding, setPadding] = createSignal(0);
  const pasaran = ["pon", "wage", "kliwon", "legi", "pahing"];
  const days = ["ahad", "senin", "selasa", "rabu", "kamis", "jum'at", "sabtu"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  function nextMonth() {
    if (month() === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
    generateCalendars();
  }

  function prevMonth() {
    if (month() === 0 && year() === 1970) {
      setMonth(0);
      setYear(1970);
      return;
    }
    if (month() === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
    generateCalendars();
  }

  onMount(() => {
    const curDate = new Date();
    setMonth(curDate.getMonth());
    setYear(curDate.getFullYear());
    generateCalendars();
  });

  function generateCalendars() {
    const firstDate = new Date(year(), month(), 1);
    const lastDate = new Date(year(), month() + 1, 0);

    const firstDay = firstDate.getDay();
    const lastDay = lastDate.getDay();
    const pasar =
      parseInt((firstDate.getTime() / (1000 * 60 * 60 * 24)).toFixed()) % 5;
    setCalendars([]);
    for (let i = 0; i < firstDay; i++) {
      setCalendars([
        ...calendars,
        {
          type: "padding",
          date: null,
        },
      ]);
    }
    setPadding(firstDay - 1);
    for (let i = firstDate.getDate(); i <= lastDate.getDate(); i++) {
      setCalendars([
        ...calendars,
        {
          type: "date",
          date: i,
          pasar: (pasar + i) % 5,
        },
      ]);
    }
    if (lastDay === 6) {
      return;
    }
    for (let i = lastDay + 1; i <= 6; i++) {
      setCalendars([
        ...calendars,
        {
          type: "padding",
          date: null,
        },
      ]);
    }
  }

  function getDayColor(day: number) {
    if (day % 7 === 0) {
      return "text-red-600";
    } else if (day % 7 === 5) {
      return "text-green-600";
    }
    return "";
  }

  function isCurrentDate(date: number) {
    return (
      date === new Date().getDate() + padding() &&
      month() === new Date().getMonth()
    );
  }

  return (
    <div class="m-auto max-w-3xl p-2">
      <div class="flex justify-between">
        <h1 class="flex flex-col font-bold">
          <span class="text-6xl">{months[month()]}</span>
          <span class="text-5xl">{year()}</span>
        </h1>
        <div>
          <button onClick={prevMonth} class="px-4 py-3">
            prev
          </button>
          <button onClick={nextMonth} class="px-4 py-3">
            next
          </button>
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <For each={days}>
          {(day, i) => (
            <div
              class={`uppercase font-bold py-6 text-center ${getDayColor(i())}`}
            >
              {day}
            </div>
          )}
        </For>
        <For each={calendars}>
          {(calendar, i) => (
            <div
              class={`${
                isCurrentDate(i()) ? "bg-gray-200" : "bg-gray-100"
              } py-4 flex flex-col items-center gap-1 ${getDayColor(i())}`}
            >
              <span class="font-bold text-2xl">{calendar.date}</span>
              <span class="text-xs uppercase">
                {calendar.pasar !== undefined ? pasaran[calendar.pasar] : ""}
              </span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default App;
