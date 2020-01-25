import { useState } from "react";
// UPDATED: 1/19/2020
// Tested and working!

window.SpeechRecognition =
	window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = !window.SpeechRecognition
	? null
	: new window.SpeechRecognition();

// BE SURE TO PASS THE CORRECT OPTIONS:
// { interimResults: true, continuous: true }
export const useSpeechRecognition = (options = {}) => {
	const isSupported = !!window.SpeechRecognition;
	const [isListening, setIsListening] = useState(false);
	const [final, setFinal] = useState(""); // final transcript

	const processResult = e => {
		const transcript = Array.from(e.results)
			.map(result => result[0])
			.map(result => result.transcript)
			.join("");
		return setFinal(transcript);
	};

	const start = () => {
		if (isListening) return;
		const { interimResults, continuous } = options;
		// SpeechRecognition stops automatically after inactivity
		// We want it to keep going until we tell it to stop
		recognition.interimResults = interimResults;
		recognition.continuous = continuous;
		setIsListening(true);
		recognition.start();

		return (recognition.onresult = e => {
			return processResult(e);
		});
	};

	const stop = () => {
		setIsListening(false);
		return recognition.stop();
	};

	return {
		isListening,
		isSupported,
		start,
		stop,
		final
	};
};
