import { EmbedBuilder, Message } from "discord.js";
import { MessageCommand } from "../../types";
import normaliseWhiteSpace from "../../utils/normaliseWhiteSpace";
import axios from "axios";

const NUM_SEARCHES = 3;
const GOOGLE_PROCESS_STRING = " ... ";

const checkForQuestion: MessageCommand = async (message: Message) => {
	if (!message.content) return;

	const messageText = normaliseWhiteSpace(message.content);

	const regex =
		/(^|(understand|know|get)?\s+)(what|which|when|where|who|whom|whose|why|how) ([^\.\?]+)[\.\?]?$/i;
	const matches = messageText.match(regex);

	if (!matches || matches.index === undefined) {
		magic8Ball(message);
		return;
	}

	const question = messageText.replaceAll("?", "%3F").replaceAll(" ", "+");

	const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${question}&num=${NUM_SEARCHES}&start=1`;

	let searchResults: any[];

	try {
		searchResults = (await axios.get(url)).data.items;
		if (!searchResults || searchResults.length === 0) {
			message.reply(
				"Sorry, I've hit the search limit for today. Have a reply anyway. 🤓",
			);
			return;
		}
	} catch (error) {
		console.log("Error fetching search results: ", error);
		return;
	}
	// const searchResults = testSearchResults;

	const processedSearchResults = new EmbedBuilder()
		.setTitle(`${messageText}${messageText.endsWith("?") ? "" : "?"}`)
		.setDescription(`Asked by ${message.member?.user}`)
		.addFields(
			...searchResults
				.map((result: any) => {
					const hasDateRegex =
						/^([a-z][a-z][a-z][a-z]?[a-z]? [0-9][0-9]?, [0-9][0-9][0-9][0-9]) \.\.\. /i;
					const dateSplitMatches = result.snippet.match(hasDateRegex);

					let [snippetDate, snippetContent]: Array<string> = ["", ""];

					snippetDate = dateSplitMatches
						? dateSplitMatches[1]
						: "Unknown";

					snippetContent = dateSplitMatches
						? result.snippet.substring(
							dateSplitMatches.index +
							dateSplitMatches[0].length,
						)
						: result.snippet;

					return {
						name: `${result.title}\n> ${snippetDate}`,
						value: `${snippetContent}\n${result.link}`,
					};
				})
				.filter((field: any) => Boolean(field)),
		).data;

	if (processedSearchResults) {
		message.reply({ embeds: [processedSearchResults] });
	} else
		console.log(
			"Unable to send empty message for original message: ",
			message.content,
		);
};

export default checkForQuestion;

// const reply = `https://letmegooglethat.com/?q=${question}`;

const testSearchResults: Array<Record<string, any>> = [
	{
		kind: "customsearch#result",
		title: "How to prevent ChatGPT from answering questions that are outside ...",
		htmlTitle:
			"How to prevent ChatGPT from answering <b>questions</b> that are outside ...",
		link: "https://community.openai.com/t/how-to-prevent-chatgpt-from-answering-questions-that-are-outside-the-scope-of-the-provided-context-in-the-system-role-message/112027",
		displayLink: "community.openai.com",
		snippet:
			"Mar 21, 2023 ... Problem. I am the developer of BeeHelp.net and it took me 3 weeks to (more or less) control the responses of the chat to certain questions.",
		htmlSnippet:
			"Mar 21, 2023 <b>...</b> Problem. I am the developer of BeeHelp.net and it took <b>me</b> 3 weeks to (more or less) control the responses of the chat to certain <b>questions</b>.",
		cacheId: "-s1K8ygJ5-IJ",
		formattedUrl:
			"https://community.openai.com/t/how-to...questions.../112027",
		htmlFormattedUrl:
			"https://community.openai.com/t/how-to...<b>question</b>s.../112027",
		pagemap: {
			cse_thumbnail: [Array],
			imageobject: [Array],
			person: [Array],
			organization: [Array],
			interactioncounter: [Array],
			metatags: [Array],
			discussionforumposting: [Array],
			comment: [Array],
			itemlist: [Array],
			cse_image: [Array],
			sitenavigationelement: [Array],
			listitem: [Array],
		},
	},
	{
		kind: "customsearch#result",
		title: "I really enjoyed the online course",
		htmlTitle: "I <b>really</b> enjoyed the online course",
		link: "http://home.miracosta.edu/jturbeville/online%20student%20comments.htm",
		displayLink: "home.miracosta.edu",
		snippet:
			"I am hoping to give you some insight as to the course and contents from recent users. Question: Let me know what you liked and didn't like about the class. How ...",
		htmlSnippet:
			"I am hoping to <b>give</b> you some insight as to the course and contents from recent users. <b>Question</b>: Let <b>me</b> know what you liked and didn&#39;t like about the class. How&nbsp;...",
		cacheId: "gQQVxphsh7MJ",
		formattedUrl:
			"http://home.miracosta.edu/jturbeville/online%20student%20comments.htm",
		htmlFormattedUrl:
			"http://home.miracosta.edu/jturbeville/online%20student%20comments.htm",
		pagemap: { metatags: [Array] },
	},
	{
		kind: "customsearch#result",
		title: "How much research effort is expected of Stack Overflow users ...",
		htmlTitle:
			"How much research effort is expected of Stack Overflow users ...",
		link: "https://meta.stackoverflow.com/questions/261592/how-much-research-effort-is-expected-of-stack-overflow-users",
		displayLink: "meta.stackoverflow.com",
		snippet:
			"May 30, 2013 ... Here we have, indeed, what looks like a very simple question about this programming language. It should really bother you that you can't find an ...",
		htmlSnippet:
			"May 30, 2013 <b>...</b> Here we have, indeed, what looks like a <b>very</b> simple <b>question</b> about this programming language. It <b>should really</b> bother you that you can&#39;t <b>find</b> an&nbsp;...",
		cacheId: "LDWMxEm7Il0J",
		formattedUrl:
			"https://meta.stackoverflow.com/questions/.../how-much-research-effort-is-e...",
		htmlFormattedUrl:
			"https://meta.stackoverflow.com/<b>question</b>s/.../how-much-research-effort-is-e...",
		pagemap: {
			cse_thumbnail: [Array],
			qapage: [Array],
			question: [Array],
			answer: [Array],
			metatags: [Array],
			cse_image: [Array],
		},
	},
];

const BALL_REACTIONS = [
	"It is certain.",
	"It is decidedly so.",
	"Without a doubt.",
	"Yes definitely.",
	"You may rely on it.",
	"As I see it, yes.",
	"Most likely.",
	"Outlook good.",
	"Yes.",
	"Signs point to yes.",
	"Reply hazy, try again.",
	"Ask again later.",
	"Better not tell you now.",
	"Cannot predict now.",
	"Concentrate and ask again.",
	"Don't count on it.",
	"My reply is no.",
	"My sources say no.",
	"Outlook not so good.",
	"Very doubtful.",
];

export const magic8Ball: MessageCommand = (message: Message) => {
	const response = `${BALL_REACTIONS[Math.floor(Math.random() * BALL_REACTIONS.length)]
		}`;
	if (message.content.endsWith("?")) {
		message.reply(`🎱 ～ "${response}"`);
	}
};
